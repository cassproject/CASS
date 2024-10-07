// For integration with the Competency Explorer developed by T3 Network.
//  This Provider Node Agent (PNA) offers an endpoint for pushing a description of a framework to an s3 bucket that is accessible by the Competency Explorer.
//  The initial use case is for JobSIDE to push frameworks (associated with Job Skills Profiles) as they are published.
//  For more information, and the schema for describing frameworks, see OCN Competency Explorer: Technical Instructions for Data Providers (Updated May 31, 2024)
//      https://docs.google.com/document/d/1w_0HDNIA9GZq76txOuS8e-OhmKJiHe9Azjuq1BfrxQ0/edit

async function pnaEndpoint() {

    EcRepository.cache = new Object();
    EcRepository.caching = true;
    if (false && repoEndpoint().contains("localhost"))
        error("Endpoint Configuration is not set.", 500);
    var query = queryParse.call(this);
    var framework = null;
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
    let pnaData = new Object();

    const now = new Date();
    const formattedNow = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

    pnaData["directory"] = {
        id: query["id"],
        type: "Directory",
        name: "Framework id " + query["id"],
        dateCreated: formattedNow
    };
    pnaData["container"] = {
        id: ceasnEndpointFramework + query["id"],
        type: "Framework",
        name: framework["name"],
        description: framework["description"]
    };
    
    if (framework.competency == null) framework.competency = [];

    let competencies = [];
    const promises = [];
    framework.competency.forEach(cid => {
        promises.push(EcRepository.get(
        EcRemoteLinkedData.trimVersionFromUrl(cid),
        null,
        null,
        repo).then((expanded) => {
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
                    dataUrl: ceasnEndpoint + ctid,
                    label: expanded["name"] ? expanded["name"] : ""
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

    const AWS_REGION = process.env.AWS_REGION ? process.env.AWS_REGION : "";
    const AWS_BUCKET = process.env.AWS_BUCKET ? process.env.AWS_BUCKET : "";
    const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID ? process.env.AWS_ACCESS_KEY_ID : "";
    const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY ? process.env.AWS_SECRET_ACCESS_KEY : "";
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
    bindWebService("/ce/pna/*", pnaEndpoint);
}
