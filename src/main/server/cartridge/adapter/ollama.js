let model = "gemma3:4b-it-qat";

// Function to check if Ollama is running locally
async function isOllamaRunning() {
    try {
        const response = await fetch('http://localhost:11434/api/pull', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                stream: false,
            }),
        });
        // console.log(response);
        return response.ok;
    } catch {
        return false;
    }
}

const ollamaApiUrl = 'http://localhost:11434/api/generate';
let request = async (prompt) => {
    const response = await fetch(ollamaApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: model,
            prompt: prompt,
            temperature: 0,
            context: this.context,
            stream: false
        }),
    });
    const result = await response.json();
    this.context = result.context;
    return result.response;
};

// Function to create a competency framework using Ollama
async function createFramework(name){
    let framework = new EcFramework();
    await request.call(this,`You are creating a human capabilities framework for "${name}". Please use doctrinal sources where available.`)
    framework.name = name;
    framework.description = await request.call(this,"Create a one paragraph description of the framework.");
    let competencies = await generateThings.call(this,framework, 5,"Task");
    return {framework,competencies};
}

async function generateThings(framework, count, type) {
    framework.competency = [];
    let results = [];
    for (let i = 0; i < count; i++) {
        let competency = new EcCompetency();
        competency.generateId(repo.selectedServerProxy || repo.selectedServer);
        await request.call(this,`What is a distinct ${type} for this framework?`);
        competency.name = await request.call(this,"What is the descriptive name of it? Please respond with only the name.");
        competency.description = await request.call(this,"How would you describe it? Please respond with only one paragraph of text.");
        framework.competency.push(competency.shortId());
        results.push(competency);
    }
    return results;
}
// Web service endpoint handler
async function ollamaEndpoint() {
    
    if (!(await isOllamaRunning())) {
        throw new Error('Ollama service is not running on localhost:11434.');
    }

    const name = this.params.name;
    if (name) {
        const framework = await createFramework.call(this,name);
        return JSON.stringify(framework,null,2);
    }
    return { status: 400, response: { error: 'Name is required.' } };
}

// Bind the web service
if (!global.disabledAdapters['ollama']) {
    bindWebService('/ollama/framework', ollamaEndpoint);
}