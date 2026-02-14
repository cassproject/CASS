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
let request = async (prompt, context) => {
    const response = await fetch(ollamaApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: model,
            prompt: prompt,
            options: {
                num_ctx: -1,
                repeat_last_n: -1,
                seed: 0,
                temperature: 0
            },
            context: context || this.context,
            stream: false
        }),
    });
    console.log("Ollama Prompt: " + prompt);
    const result = await response.json();
    this.context = result.context;
    console.log("Ollama Response: " + result.response.substring(0, 100) + "...");
    return { context: result.context, response: result.response };
};

// Function to create a competency framework using Ollama
async function createFramework(name) {
    let framework = new EcFramework();
    if (name == null)
        await request.call(this, `You are creating a human capabilities framework. Please use doctrinal sources where available. Use English. Avoid conjunctions. Be succinct. Answer the question without pontification.`)
    else
        await request.call(this, `You are creating a human capabilities framework for "${name}". Please use doctrinal sources where available. Use English. Avoid conjunctions. Be succinct. Answer the question without pontification.`)
    framework.name = name || "Human Capabilities Framework";
    let { context, response } = await request.call(this, "Create a one paragraph description of the framework.");
    framework.description = response;
    framework.context = context;
    let competencies = await generateThings.call(this, [], 5, "Task", context, [2, 2]);
    return { framework, competencies };
}

async function generateThings(parents, count, type, context, levels) {
    let results = [];
    let asPartOf = "";
    if (parents?.length > 0)
        for (let i = 0; i < parents.length; i++) {
            let parent = parents[i];
            if (i == 0)
                asPartOf = `"${parent.name}".`;
            else
                asPartOf += ` as part of "${parent.name}".`;
        }
    for (let j = 0; j < count; j++) {
        let competency = new EcCompetency();
        competency.generateId(repo.selectedServerProxy || repo.selectedServer);
        if (j == 0) {
            if (parents == null)
                competency.name = (await request.call(this, `What is the name of the most important ${type}? Respond with only the name.`, context)).response;
            else
                competency.name = (await request.call(this, `What is the name of the most important ${type} required for ${asPartOf}? Respond with only the name.`, context)).response;
        }
        else {
            if (parents == null)
                competency.name = (await request.call(this, `What is the name of the next most important ${type}? Respond with only the name.`, context)).response;
            else
                competency.name = (await request.call(this, `What is the name of the next most important ${type} required for ${asPartOf}? Respond with only the name.`, context)).response;
        }
        // competency.name = (await request.call(this,"What is the declarative name? Please respond with only the name.")).response;
        let { outContext, response } = await request.call(this, "What is the description? Please respond with only one paragraph of text.");
        competency.description = response;
        competency.context = outContext;
        competency.parent = parents?.map(p => p.shortId());
        competency["dcterms:type"] = type;
        if (levels.length > 0) {
            let subThings = await Promise.all([
                generateThings([...parents, competency], levels[0], "Task", outContext, levels.slice(1)),
                generateThings([...parents, competency], levels[0], "Knowledge", outContext, levels.slice(1)),
                generateThings([...parents, competency], levels[0], "Skill", outContext, levels.slice(1)),
                generateThings([...parents, competency], levels[0], "Natural Ability", outContext, levels.slice(1))
            ]);
            //results.push(...subThings.flat());
            competency.children = subThings.flat();
        }
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
        const framework = await createFramework.call(this, name);
        return JSON.stringify(framework, null, 2);
    }
    return { status: 400, response: { error: 'Name is required.' } };
}

// Bind the web service
if (!global.disabledAdapters['ollama']) {
    /**
     * @openapi
     * /api/ollama/framework:
     *   post:
     *     tags:
     *       - Ollama Adapter
     *     summary: Generate a competency framework using a local Ollama LLM
     *     description: |
     *       Connects to a local Ollama instance (localhost:11434) and uses a
     *       language model to generate a competency framework with hierarchical
     *       tasks, knowledge, skills, and natural abilities. Requires Ollama
     *       to be running locally.
     *     parameters:
     *       - in: query
     *         name: name
     *         required: true
     *         schema:
     *           type: string
     *         description: Name / topic for the framework to generate.
     *     responses:
     *       200:
     *         description: Generated framework JSON.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *       400:
     *         description: Name parameter is required.
     *       500:
     *         description: Ollama service is not running on localhost:11434.
     */
    bindWebService('/ollama/framework', ollamaEndpoint);
}