const { skyrepoGet } = require('../../skyRepo/get');
// For integration with the Competency Explorer developed by T3 Network.
//  This Provider Node Agent (PNA) offers an endpoint for pushing a description of a framework to an s3 bucket that is accessible by the Competency Explorer.
//  The initial use case is for JobSIDE to push frameworks (associated with Job Skills Profiles) as they are published.
//  For more information, and the schema for describing frameworks, see OCN Competency Explorer: Technical Instructions for Data Providers (Updated May 31, 2024)
//      https://docs.google.com/document/d/1w_0HDNIA9GZq76txOuS8e-OhmKJiHe9Azjuq1BfrxQ0/edit

async function pnaEndpoint() {
    EcRepository.cache = {};
    EcRepository.caching = true;
    let query = queryParse.call(this);
    let framework = null;
    if (framework == null)
        framework = await skyrepoGet.call(this, query);

    if (!framework["@id"]) {
        return "Unable to find framework: " + query["id"];
    }

    let match = framework["@id"].match('(.*)(\/data\/)(.*)');
    let ceasnEndpointFramework = match && match.length > 1 ? match[1] + "/ceasn/" : undefined;

    if (!ceasnEndpointFramework) {
        return "Unable to generate ceasn output from framework: " + query["id"];
    }

    // Data from the framework to be stored in Competency Explorer registry for indexing
    let pnaData = {};

    const now = new Date();
    const formattedNow = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

    pnaData["directory"] = {
        id: process.env.PNA_DIRECTORY ? process.env.PNA_DIRECTORY : "",
        type: "Directory",
        name: process.env.PNA_DIRECTORY_NAME ? process.env.PNA_DIRECTORY_NAME : "",
        dateCreated: formattedNow
    };
    let attribution = "";
    if (framework["ceterms:ownedBy"]) {
        if (Array.isArray(framework["ceterms:ownedBy"]) && framework["ceterms:ownedBy"].length > 0) {
            attribution = framework["ceterms:ownedBy"][0];
        } else {
            attribution = framework["ceterms:ownedBy"];
        }
    }
    if (attribution == "" && framework["schema:author"]) {
        if (Array.isArray(framework["schema:author"]) && framework["schema:author"].length > 0) {
            attribution = framework["schema:author"][0];
        } else {
            attribution = framework["schema:author"];
        }
    }
    pnaData["container"] = {
        id: ceasnEndpointFramework + query["id"],
        type: "Collection",
        fromDirectory: process.env.PNA_DIRECTORY ? process.env.PNA_DIRECTORY : "",
        name: framework["name"],
        description: framework["description"],
        attributionName: attribution.startsWith('http') ? "" : attribution,
        attributionURL: attribution.startsWith('http') ? attribution : "",
        beneficiaryRights: framework["ceasn:license"] ? framework["ceasn:license"] : (framework["schema:license"] ? framework["schema:license"] : ""),
        dataURL: ceasnEndpointFramework + query["id"],
        providerMetaModel: process.env.PNA_PROVIDER_META_MODEL ? process.env.PNA_PROVIDER_META_MODEL : "",
        registryRights: process.env.PNA_REGISTRY_RIGHTS ? process.env.PNA_REGISTRY_RIGHTS : "",
    };

    if (framework.competency == null) framework.competency = [];

    let competencies = [];
    const promises = [];
    framework.competency.forEach((cid) => {
        promises.push(EcRepository.get(
            EcRemoteLinkedData.trimVersionFromUrl(cid),
            null,
            null,
            repo
        ).then((expanded) => {
            if (expanded && expanded["id"]) {
                match = expanded["id"].match('(.*)(\/data\/)(.*)');
                let ceasnEndpoint = match && match.length > 1 ? match[1] + "/ceasn/" : undefined;
                match = expanded["id"].match('(.*)Competency\/(.*)');
                let ctid = (match && match.length > 2) ? match[2] : '';
                ctid = ctid.split("/")[0];
                competencies.push({
                    id: ceasnEndpoint + ctid,
                    type: "Competency",
                    containedIn: ceasnEndpointFramework + query["id"],
                    competencyText: expanded["statement"] ? expanded["statement"] : (expanded["name"] ? expanded["name"] : (expanded["description"] ? expanded["description"] : "")),
                    dataURL: ceasnEndpoint + ctid,
                    competencyLabel: expanded["name"] ? expanded["name"] : ""
                });
            }
        }).catch((err) => {
            return;
        }));
    })
    await Promise.all(promises).then(() => {
        pnaData["competencies"] = competencies;
    }).catch((err) => {
        pnaData["competencies"] = [];
    });

    if (this.params.methodType == "POST" || this.params.methodType == "PUT") {
        // Upload index file to Competency Explorer registry
        const result = await uploadToAws(JSON.stringify(pnaData), query["id"]);
        return JSON.stringify(result);
    } else {
        return JSON.stringify(pnaData);
    }
}

async function uploadToAws(data, name) {
    const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

    const AWS_REGION = process.env.PNA_AWS_REGION ? process.env.PNA_AWS_REGION : "";
    const AWS_BUCKET = process.env.PNA_AWS_BUCKET ? process.env.PNA_AWS_BUCKET : "";
    const AWS_ACCESS_KEY_ID = process.env.PNA_AWS_ACCESS_KEY_ID ? process.env.PNA_AWS_ACCESS_KEY_ID : "";
    const AWS_SECRET_ACCESS_KEY = process.env.PNA_AWS_SECRET_ACCESS_KEY ? process.env.PNA_AWS_SECRET_ACCESS_KEY : "";
    let success = false;

    try {
        if (!name) {
            global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, "pnaUploadErr", 'No framework provided');
            return {
                framework: undefined,
                success: false
            };
        }
        if (!AWS_REGION) {
            global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, "pnaUploadErr", 'No AWS Region provided');
            return {
                framework: name,
                success: false
            };
        }
        if (!AWS_BUCKET) {
            global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, "pnaUploadErr", 'No AWS Bucket provided');
            return {
                framework: name,
                success: false
            };
        }
        if (!AWS_ACCESS_KEY_ID) {
            global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, "pnaUploadErr", 'No AWS Access key provided');
            return {
                framework: name,
                success: false
            };
        }
        if (!AWS_SECRET_ACCESS_KEY) {
            global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, "pnaUploadErr", 'No AWS Access secret provided');
            return {
                framework: name,
                success: false
            };
        }
        const s3 = new S3Client({
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_SECRET_ACCESS_KEY
            },
            region: AWS_REGION,
        });

        const put = new PutObjectCommand({
            Bucket: AWS_BUCKET,
            Key: name,
            Body: data
        })
        await s3.send(put).then(() => {
            global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, "pnaUploadOk", name);
            success = true;
        }).catch((err) => {
            global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, "pnaUploadErr", name);
            global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, "pnaUploadErr", err);
            success = false;
        });
        return {
            framework: name,
            success: success
        };
    } catch (err) {
        global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, "pnaUploadErr", name);
        global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, "pnaUploadErr", err);
        return {
            framework: name,
            success: false
        };
    }
}

if (!global.disabledAdapters['ce']) {
    /**
     * @openapi
     * /api/ce/pna/{id}:
     *   get:
     *     tags:
     *       - PNA Adapter
     *     summary: Get PNA index data for a framework
     *     description: |
     *       Generates a Provider Node Agent (PNA) index document for the T3
     *       Network Competency Explorer, including directory metadata,
     *       framework container info, and a list of competencies.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Framework identifier.
     *     responses:
     *       200:
     *         description: PNA index JSON with directory, container, and competencies.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *   post:
     *     tags:
     *       - PNA Adapter
     *     summary: Publish PNA index to the Competency Explorer S3 registry
     *     description: |
     *       Generates the PNA index and uploads it to the configured AWS S3
     *       bucket for the Competency Explorer registry. Requires PNA_AWS_*
     *       environment variables to be configured.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Framework identifier.
     *     responses:
     *       200:
     *         description: Upload result with framework ID and success status.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 framework:
     *                   type: string
     *                 success:
     *                   type: boolean
     */
    bindWebService("/ce/pna/*", pnaEndpoint);
}
