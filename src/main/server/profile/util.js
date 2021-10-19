module.exports = {
/** Will NOT return null, but may throw errors. */
anythingToPem: async(subject) => {
    if (typeof subject === "string" && subject.startsWith("-----BEGIN")) {
        return subject;
    }

    return anythingToPerson(subject).then(person => {
        if (person == null) throw new exports.NotFoundError();
        return person.owner[0];
    }).catch(e => {
        throw e;
    });
},
anythingToPerson: async(subject) => {
    // No/Invalid subject?
    if (subject == null) throw new exports.ParseError();

    let result;

    // Subject is URL?
    if (typeof subject === "string" && subject.startsWith("http")) {
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
                people = await cass.personSearch(`owner:"${subject}"`, {});
                people = people.filter((p) => p.owner[0] == subject);
                if (people.length > 0) person = people[0];
                if (people.length > 1) console.log("Looking for person, found people! " + people.length);
            }
        } catch (e) {
            console.trace(e);
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
            people = await cass.personSearch(`email:"${subject}" OR username:"${subject}"`, {});
        } catch (e) {
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
}