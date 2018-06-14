
function base64ToBlob(base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = forge.util.decode64(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
}

function stringToFile(string,filename,contentType){
	return new File([string],filename,{type:contentType});
}

function ecKeys(obj){return Object.keys(obj);}

function ab2str(buf) {
	return new TextDecoder("utf-8").decode(buf);
}

function str2ab(str) {
	return new TextEncoder("utf-8").encode(str).buffer;
}

function ecLog(str){
if (console)
	if (console.log)
	{
		console.log(str);
		return;
	}
else
	if (print)
		print(str);
}