# CaSS
Competency and Skills Service -- Competency Management

Mainline: 1.6.x

[High level documentation](https://docs.cassproject.org)  
[Developer documentation](https://devs.cassproject.org)

# Purpose of this Document
This document is intended to act as a technical guide to the installation of CaSS.

This installation of CaSS will provide several components that operate to provide a working system. It is composed of:
 * The CaSS Repository, a Node JS application.
 * The CaSS Library, a Javascript library that provides an interoperability layer between web applications and the CaSS Repository.
 * CaSS Embeddable Apps, a set of iframeable applications for branded web applications.
 * CaSS Adapters, which provide particular functionality, typically standards based (xAPI, CTDL-ASN, etc).

## Docker

Docker images for standalone instances (based on Elasticsearch's container) and distributed/scalable instances (based on Node, Alpine Linux, and Distroless) can be found at:

https://hub.docker.com/r/cassproject/cass

# CaSS Libraries
## From GitHub

https://github.com/cassproject/cass-npm

## NPM

https://www.npmjs.com/package/cassproject

# Installation
## Ubuntu/Fedora Linux:

    wget https://raw.githubusercontent.com/cassproject/CaSS/master/scripts/cassInstall.sh
    chmod +x cassInstall.sh
    sudo ./cassInstall.sh
    
During the installation, you will be asked to select a version to install. Versions are listed at the top of this document.

# Post Installation
To support open linked data, it is important that the objects created in CaSS have public, reliable URLs. For this:

 * Assign this server a domain name.
 * Enable HTTPS.
 * (Optional) Use a reverse proxy to control the endpoint closely.

# Running Locally
After cloning this repository (ensure you use git clone with --recurse-submodules!), you can run CaSS locally.

Dependencies: Docker (will pull and run elasticsearch on port 9200)

## Getting things up and running

 * `git clone --recurse-submodules -b <branch> https://github.com/cassproject/CASS` - Get the code.
 * `npm i` - Install dependencies.
 * `npm run dev` - Starts server, restarts server on-save.

## In a separate command line, if you want unit tests:

 * `npm test` - Runs server, cass-npm and cass unit tests, runs them again on-save. Don't run with dev.

## Generating documentation
Will be deposited in `/docs`

 * `npm run docs`

## Running it like it's in prod

Use containerized builds, see compose files in the root for examples.

## A note on Elasticsearch and 1.5
Due to the performance improvements in the 1.5 version of CaSS, we highly recommend using Elasticsearch 9 with it as it's better configured to handle the load than previous versions.

## Release Process
The CaSS release process is automated via GitHub Actions. For detailed instructions on how to trigger a release, see [RELEASE.md](RELEASE.md).

### FIPS:
FIPS is supported both client-side and server-side in CaSS. Here is the relevant compatibility table.

Sources: https://openssl-library.org/post/2025-03-11-fips-140-3/

| --> Server --> | < 1.5.35 | >= 1.5.35 with <br> OpenSSL 3.1.2 and<br> --force-fips | >= 1.5.35 with <br>OpenSSL 3.1.2 and<br> --force-fips and<br> env REJECT_SHA1=true |
| - | - | - | - |
| **Client/Library** | |
| < 1.5.35 | SHA-1 (no FIPS) | SHA-1 (Verify only) | Incompatible
| < 1.5.35 and<br> OpenSSL 3.0.8 and<br> env FIPS=true | SHA-1 (partial FIPS) | SHA-1 (Verify only) | Incompatible
| >= 1.5.35 | SHA-1 (no FIPS) | SHA-1 (Verify only*), SHA-256 (FIPS) | SHA-256 (FIPS)
| >= 1.5.35 and<br> env FIPS=true | SHA-1 (partial FIPS) | SHA-1 (Verify only*), SHA-256 (FIPS) | SHA-256 (FIPS)
| >= 1.5.35 and<br> --force-fips | Incompatible | SHA-256 (FIPS) | SHA-256 (FIPS)

To get FIPS, it is recommended to use the docker container builds.

Partial FIPS means that we are still violating FIPS by using SHA-1 hashing. All other cryptographic operations are using the FIPS module.

Verify only uses the exception that permits SHA-1 verification but not generation.

Verify only* may fall back to SHA-1 verification if SHA-256 negotiation failed, but typically will not use SHA-1.
