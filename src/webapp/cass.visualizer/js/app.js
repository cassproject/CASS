var repo = new EcRepository();
repo.selectedServer = "http://sandbox.service.cassproject.org/";

function error(error) {
    alert(error);
}

function isObject(obj) {
  return toString.call(obj) == '[object Object]';
}

function isArray(obj) {
  return toString.call(obj) == '[object Array]';
}