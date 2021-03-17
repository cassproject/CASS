let frameworkGet = async function(id){
    return new Promise(
        function(resolve,reject){
            EcFramework.get(
                id,
                function(f){resolve(f);},
                function(error){reject(error);}
            );
        }
    );
};
let frameworkSearch = async function(repo,query,params){
    return new Promise(
        function(resolve,reject){
            EcFramework.search(
                repo,
                query,
                function(fs){resolve(fs)},
                function(error){reject(error)},
                params
            );
        }
    );
};
let competencyGet = async function(id){
    return new Promise(
        function(resolve,reject){
            EcCompetency.get(
                id,
                function(f){resolve(f);},
                function(error){reject(error);}
            );
        }
    );
};
let repositoryGet = async function(id){
    return new Promise(
        function(resolve,reject){
            EcRepository.get(
                id,
                function(f){resolve(f);},
                function(error){reject(error);}
            );
        }
    );
};
let repositorySearch = async function(repo,query,params){
    return new Promise(
        function(resolve,reject){
            repo.searchWithParams(
                repo,
                query,
                params,
                function(f){},
                function(fs){resolve(fs)},
                function(error){reject(error)},
            );
        }
    );
};
let alignmentGet = async function(id){
    return new Promise(
        function(resolve,reject){
            EcAlignment.get(
                id,
                function(f){resolve(f);},
                function(error){reject(error);}
            );
        }
    );
};

let conceptGet = async function(id){
    return new Promise(
        function(resolve,reject){
            EcConcept.get(
                id,
                function(f){resolve(f);},
                function(error){reject(error);}
            );
        }
    );
};

let multiput = async function(repo,ary){
    return new Promise(
        function(resolve,reject){
            repo.multiput(
                ary,
                function(f){resolve(f);},
                function(error){reject(error);}
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