let frameworkGet = async function (id) {
    return new Promise(
        function (resolve, reject) {
            return EcFramework.get(
                id,
                function (f) {
                    resolve(f);
                },
                function (error) {
                    reject(error); // NOSONAR - We support non-Error strings.
                },
                repo
            );
        }
    );
};
let frameworkSearch = async function (repo, query, params) {
    return new Promise(
        function (resolve, reject) {
            return EcFramework.search(
                repo,
                query,
                function (fs) {
                    resolve(fs)
                },
                function (error) {
                    reject(error); // NOSONAR - We support non-Error strings.
                },
                params
            );
        }
    );
};
let competencyGet = async function (id) {
    return new Promise(
        function (resolve, reject) {
            return EcCompetency.get(
                id,
                function (f) {
                    resolve(f);
                },
                function (error) {
                    reject(error); // NOSONAR - We support non-Error strings.
                },
                repo
            );
        }
    );
};
let repositoryGet = async function (id) {
    return new Promise(
        function (resolve, reject) {
            return EcRepository.get(
                id,
                function (f) {
                    resolve(f);
                },
                function (error) {
                    reject(error); // NOSONAR - We support non-Error strings.
                },
                repo
            );
        }
    );
};
let repositorySearch = async function (repo, query, params) {
    return new Promise(
        function (resolve, reject) {
            return repo.searchWithParams(
                query,
                params,
                function (f) { },
                function (fs) {
                    resolve(fs)
                },
                function (error) {
                    reject(error); // NOSONAR - We support non-Error strings.
                },
            );
        }
    );
};
let alignmentGet = async function (id) {
    return new Promise(
        function (resolve, reject) {
            return EcAlignment.get(
                id,
                function (f) {
                    resolve(f);
                },
                function (error) {
                    reject(error); // NOSONAR - We support non-Error strings.
                },
                repo
            );
        }
    );
};

let conceptGet = async function (id) {
    return new Promise(
        function (resolve, reject) {
            return EcConcept.get(
                id,
                function (f) {
                    resolve(f);
                },
                function (error) {
                    reject(error); // NOSONAR - We support non-Error strings.
                },
                repo
            );
        }
    );
};

let multiput = async function (repo, ary) {
    return new Promise(
        function (resolve, reject) {
            return repo.multiput(
                ary,
                function (f) {
                    resolve(f);
                },
                function (error) {
                    reject(error); // NOSONAR - We support non-Error strings.
                }
            );
        }
    );
};

module.exports = {
    frameworkGet,
    frameworkSearch,
    competencyGet,
    repositoryGet,
    repositorySearch,
    alignmentGet,
    conceptGet,
    multiput
}