# DEPLOYMENT.md — Deploying CaSS

This guide covers three deployment methods: local development, Docker Hub images, and Kubernetes. Each bundles CaSS with Elasticsearch 9.x.

See also [CONFIGURATION.md](CONFIGURATION.md) for all configuration options and [FILE.md](FILE.md) for project structure.

---

## 1. Local Development

### Prerequisites

- Node.js 24+
- Elasticsearch 9.x running locally on port 9200

### Start Elasticsearch

```bash
docker run -d --name elasticsearch \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  -e "xpack.security.enrollment.enabled=false" \
  -e "xpack.security.http.ssl.enabled=false" \
  -e "xpack.security.transport.ssl.enabled=false" \
  -e "ES_JAVA_OPTS=-Xms2g -Xmx2g" \
  docker.elastic.co/elasticsearch/elasticsearch:9.2.5
```

### Install and Run CaSS

```bash
git clone https://github.com/cassproject/CASS.git
cd CASS
npm install
npm run dev
```

CaSS is available at `http://localhost/api/`.

### Environment

Set environment variables inline or via `.env`:

```bash
ELASTICSEARCH_ENDPOINT=http://localhost:9200 \
PORT=80 \
npm run dev
```

---

## 2. Docker Hub (docker.io)

Pre-built images are available at [cassproject/cass](https://hub.docker.com/r/cassproject/cass).

### Quick Start

```bash
docker compose up -d
```

This uses the root [docker-compose.yml](docker-compose.yml) which starts:
- **cass** — CaSS on port 80 (HTTP)
- **cassl** — CaSS on port 443 (HTTPS with HTTP/2)
- **elasticsearch-cass** — Elasticsearch 9.2.5

### Image Variants

| Compose File | Base | Use Case |
|---|---|---|
| `docker-compose.yml` | Debian `node:24-slim` | Default — FIPS-enabled |
| `docker-compose-alpine.yml` | Alpine `node:24-alpine` | Smaller image (~40% less) |
| `docker-compose-distroless.yml` | `gcr.io/distroless/nodejs24` | Hardened — no shell, no package manager |
| `docker-compose-opensearch.yml` | Debian `node:24-slim` | OpenSearch instead of Elasticsearch |

```bash
# Alpine variant
docker compose -f docker-compose-alpine.yml up -d

# Distroless variant
docker compose -f docker-compose-distroless.yml up -d
```

### Custom Configuration

Override environment variables in the compose file or via a `.env` file:

```bash
# .env
CASS_OIDC_ENABLED=true
CASS_OIDC_ISSUER_BASE_URL=https://keycloak.example.com/auth/realms/master/
CASS_OIDC_CLIENT_ID=cass
CASS_OIDC_SECRET=your-secret
```

### Persistent Data

The compose files define two volumes:

| Volume | Purpose |
|--------|---------|
| `etc` | CaSS server keys and adapter config (mounted at `/app/etc`) |
| `esdata1` | Elasticsearch indices and data |

> [!CAUTION]
> Back up both volumes before destroying containers. Losing `etc` means losing all server keys. Losing `esdata1` means losing all stored data.

### Custom TLS Certificates

Mount your own certificates:

```yaml
services:
  cassl:
    volumes:
      - ./certs/server.key:/app/cass.key:ro
      - ./certs/server.crt:/app/cass.crt:ro
      - ./certs/ca.crt:/app/ca.crt:ro
```

---

## 3. Kubernetes

### Prerequisites

- Kubernetes 1.28+
- `kubectl` configured
- Persistent storage provisioner (for Elasticsearch data and CaSS `etc/`)

### Namespace

```bash
kubectl create namespace cass
```

### Elasticsearch StatefulSet

```yaml
# elasticsearch.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: elasticsearch
  namespace: cass
spec:
  serviceName: elasticsearch
  replicas: 1
  selector:
    matchLabels:
      app: elasticsearch
  template:
    metadata:
      labels:
        app: elasticsearch
    spec:
      containers:
        - name: elasticsearch
          image: docker.elastic.co/elasticsearch/elasticsearch:9.2.5
          ports:
            - containerPort: 9200
          env:
            - name: discovery.type
              value: single-node
            - name: xpack.security.enabled
              value: "false"
            - name: xpack.security.enrollment.enabled
              value: "false"
            - name: xpack.security.http.ssl.enabled
              value: "false"
            - name: xpack.security.transport.ssl.enabled
              value: "false"
            - name: ES_JAVA_OPTS
              value: "-Xms2g -Xmx2g"
            - name: bootstrap.memory_lock
              value: "true"
          resources:
            requests:
              memory: "3Gi"
              cpu: "1"
            limits:
              memory: "4Gi"
              cpu: "2"
          volumeMounts:
            - name: es-data
              mountPath: /usr/share/elasticsearch/data
  volumeClaimTemplates:
    - metadata:
        name: es-data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 50Gi
---
apiVersion: v1
kind: Service
metadata:
  name: elasticsearch
  namespace: cass
spec:
  selector:
    app: elasticsearch
  ports:
    - port: 9200
      targetPort: 9200
  clusterIP: None
```

### CaSS Deployment

```yaml
# cass.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cass-config
  namespace: cass
data:
  CASS_LOOPBACK: "http://cass:80/api/"
  ELASTICSEARCH_ENDPOINT: "http://elasticsearch:9200"
  PORT: "80"
  # Add OIDC, banner, or other config here.
  # See CONFIGURATION.md for all options.
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cass
  namespace: cass
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cass
  template:
    metadata:
      labels:
        app: cass
    spec:
      containers:
        - name: cass
          image: cassproject/cass:latest
          ports:
            - containerPort: 80
          envFrom:
            - configMapRef:
                name: cass-config
          resources:
            requests:
              memory: "512Mi"
              cpu: "250m"
            limits:
              memory: "2Gi"
              cpu: "2"
          volumeMounts:
            - name: cass-etc
              mountPath: /app/etc
          readinessProbe:
            httpGet:
              path: /api/ping
              port: 80
            initialDelaySeconds: 15
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /api/ping
              port: 80
            initialDelaySeconds: 30
            periodSeconds: 30
      volumes:
        - name: cass-etc
          persistentVolumeClaim:
            claimName: cass-etc
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: cass-etc
  namespace: cass
spec:
  accessModes: ["ReadWriteOnce"]
  resources:
    requests:
      storage: 1Gi
---
apiVersion: v1
kind: Service
metadata:
  name: cass
  namespace: cass
spec:
  selector:
    app: cass
  ports:
    - port: 80
      targetPort: 80
  type: ClusterIP
```

### Ingress (Optional)

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: cass
  namespace: cass
  annotations:
    nginx.ingress.kubernetes.io/proxy-body-size: "50m"
spec:
  rules:
    - host: cass.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: cass
                port:
                  number: 80
  tls:
    - hosts:
        - cass.example.com
      secretName: cass-tls
```

### Deploy

```bash
kubectl apply -f elasticsearch.yaml
kubectl apply -f cass.yaml
kubectl apply -f ingress.yaml    # optional

# Verify
kubectl -n cass get pods
kubectl -n cass logs deployment/cass
```

### Scaling Notes

- **CaSS** can be scaled horizontally (`replicas: N`), but each replica must share the same `etc/` volume (use `ReadWriteMany` storage or a shared PVC).
- **Elasticsearch** should be scaled using the [ECK Operator](https://www.elastic.co/guide/en/cloud-on-k8s/current/index.html) for production multi-node clusters.
- The `/api/ping` endpoint is used for both readiness and liveness probes.

### Secrets Management

For sensitive values (OIDC secrets, SMTP passwords), use Kubernetes Secrets instead of ConfigMaps:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cass-secrets
  namespace: cass
type: Opaque
stringData:
  CASS_OIDC_SECRET: "your-client-secret"
  SMTP_PASS: "your-smtp-password"
```

Reference in the deployment:

```yaml
envFrom:
  - configMapRef:
      name: cass-config
  - secretRef:
      name: cass-secrets
```

---

## Health Checks

All deployment methods can use the ping endpoint for health checking:

```
GET /api/ping
```

Returns `200` with server info including `ping: "pong"` and the current time. See [CONFIGURATION.md](CONFIGURATION.md) for the full response schema.

---

## Next Steps

- Configure authentication — see [CONFIGURATION.md → Authentication Modes](CONFIGURATION.md#authentication-modes)
- Set up adapters — see [CONFIGURATION.md → Adapter Configuration](CONFIGURATION.md#adapter-configuration)
- Customize the UI — see [CONFIGURATION.md → UI Customization](CONFIGURATION.md#ui-customization)
