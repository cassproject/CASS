const EcPerson = require("cassproject/src/org/schema/EcPerson");

/** Will NOT return null, but may throw errors. */
let anythingToPem = global.anythingToPem = async(subject) => {
    if (typeof subject === "string" && subject.startsWith("-----BEGIN")) {
        return subject;
    }

    return anythingToPerson(subject).then(person => {
        if (person == null) throw new exports.NotFoundError();
        if (EcArray.isArray(person))
            return person.map((p)=>p.owner[0]);
        return person.owner[0];
    }).catch(e => {
        throw e;
    });
};

let anythingToPerson = global.anythingToPerson = async(subject) => {
    // No/Invalid subject?
    if (subject == null) throw new exports.ParseError();

    let result;
    if (EcArray.isArray(subject))
        result = await Promise.all(subject.map(anythingToPerson));
    // Subject is URL?
    else if (typeof subject === "string" && subject.startsWith("http")) {
        const url = subject;
        let person;
        try {
            person = await EcPerson.get(url);
        } catch (e) {
            error(e,500);
        }

        if (person == null) 
            error("Person not found.",400);

        result = person;
    } else if (typeof subject === "string" && subject.startsWith("-----BEGIN")) {
        // Subject is PEM
        subject = EcPk.fromPem(subject).toPem();
        let person;
        try {
            person = await EcPerson.getByPk(repo, EcPk.fromPem(subject)).catch(() => {});
            if (person == null) {
                people = await EcPerson.search(repo,`owner:"${subject}"`);
                people = people.filter((p) => p.owner[0] == subject);
                if (people.length > 0) person = people[0];
                if (people.length > 1) global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.INFO, "AnythingToPerson", `Looking for person, found people! ${people.length}`);
            }
        } catch (e) {
            global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.ERROR, "AnythingToPerson", e);
            if (e instanceof TypeError) {
                throw new exports.ParseError();
            } else throw new exports.UnknownError(e.message);
        }

        if (person == null) throw new exports.NotFoundError("Could not find " + subject);

        result = person;
    } else if (typeof subject === "string") {
        // Subject is an Email or Username
        let people;
        try {
            people = await EcPerson.search(repo,`email:"${subject}" OR username:"${subject}"`);
        } catch (e) {
            global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.ERROR, "AnythingToPerson", e);
            throw new exports.UnknownError(e.message);
        }
        if (people == null || people.length === 0) throw new exports.NotFoundError();

        result = people[0];
    }

    if (result != null) {
        if (result.personType != null && result.personType !== "Person")
            throw new exports.NotFoundError("No Person found for " + subject);
        return result;
    }

    throw new exports.ParseError();
}
module.exports = {
/** Will NOT return null, but may throw errors. */
anythingToPem: anythingToPem,
anythingToPerson: anythingToPerson
}