function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
function isString(obj) {
  return toString.call(obj) == '[object String]';
}
function isObject(obj) {
  return toString.call(obj) == '[object Object]';
}
function isFunction(obj) {
 var getType = {};
 return obj && getType.toString.call(obj) === '[object Function]';
}
function is(obj,is) {
  return toString.call(obj) == '[object '+is+']';
}
function isArray(obj) {
  return toString.call(obj) == '[object Array]';
}
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

var copyEvent = null;
function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a flash,
  // so some of these are just precautions. However in IE the element
  // is visible whilst the popup box asking the user for permission for
  // the web page to copy to the clipboard.
  //

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';


  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  document.removeEventListener("copy",copyEvent,true);
  document.removeEventListener("copy",copyEvent,false);
  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.addEventListener("copy",copyEvent);
  document.body.removeChild(textArea);
}

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}
function downloadBase64(filename, base64) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;base64,' + base64);
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

function stringifyJSON(obj){
    keys = [];
    if(obj){
        for(var key in obj){
            keys.push(key);
        }
    }
    keys.sort();
    var tObj = {};
    var key;
    for(var index in keys){
        key = keys[index];
        if (obj[key] !== undefined)
        tObj[ key ] = obj[ key ];
    }
    return JSON.stringify(tObj);
}

function trim(str, characters) {
  var c_array = characters.split('');
  var result  = '';

  for (var i=0; i < characters.length; i++)
    result += '\\' + c_array[i];

  return str.replace(new RegExp('^[' + result + ']+|['+ result +']+$', 'g'), '');
}

function createContactSmall(pem) {
    var ident = AppController.identityController.lookup(pem);
    var contact = '<span class="ownershipDisplay has-tip" tabindex pk="' + pem + '">' + '<span class="qrcodeCanvas"></span>' + '<span class="contactText" >' + ident.displayName + '</span>' + '</span>';
    
    timeout(function(){
        $('[pk="'+pem+'"]').children(".qrcodeCanvas:empty").html("").qrcode({
	            width: 256,
	            height: 256,
	            text: pem.replaceAll(/[\r\n]/g, "").trim()
        }).off("click.qr").on("click.qr",null,null,
        	function(){
        		copyTextToClipboard(pem);
        		alert("Public key copied to clipboard.");
        	}
        );
    });
    
    return contact;
}
