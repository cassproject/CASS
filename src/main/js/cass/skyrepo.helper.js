

/**
 * Helper function to flatten any string-language objects (Objects 
 * with @value and @lang fields only) into an elasticsearch
 * friendly type
 *  
 * @param jsonLd object to flatten
 * @returns flattened jsonLd object as String
 */
// @first is an internal parameter to indicate which call is not a recursive call (used to return a string object at the end)
function flattenStringFields(jsonLd, first){
	
	if(jsonLd == undefined){
		jsonLd = JSON.parse(this.params.obj);
		first = true;
	}

	if(Array.isArray(jsonLd)){
		var ret = [];
		
		for(idx in jsonLd){
			ret.push(flattenStringFields(jsonLd[idx], false));
		}
		
		return ret;
	}else if(jsonLd === Object(jsonLd)){
		for(var key in jsonLd){
			try{
				var field = jsonLd[key];

				// Check if objects in array are string-language objects
				if(Array.isArray(field)){
					var flattenText = true; // flag identifying if they are string-language objects
					var textArray = [];
					var langArray = [];
					for(var idx in field){
						var obj = field[idx];
						
						if(obj === Object(obj)){
							if(Object.keys(obj).length == 2 && obj["@value"] != undefined && obj["@language"] != undefined){
								textArray.push(obj["@value"]);
								langArray.push(obj["@language"]);
							}else{
								flattenText = false
							}
						}else{
							flattenText = false;
						}
					}
					// if not string-language objects keep recursing
					if(!flattenText){
						jsonLd[key] = flattenStringFields(field, false);
					// otherwise flatten @value to field and create <key>@language field
					}else{
						jsonLd[key] = textArray;
						jsonLd[key+"@language"] = langArray;
					}	
				// Check if object is a string-language object
				}else if(field === Object(field)){
					// if string-language object flatten @value to field and create <key>@language field
					if(Object.keys(field).length == 2 && field["@value"] != undefined && field["@language"] != undefined){
						jsonLd[key] = field["@value"];
						jsonLd[key+"@language"] = field["@language"];
					// otherwise keep recursing
					}else if (Object.keys(field).length > 0){
						jsonLd[key] = flattenStringFields(field, false);
					}	
				}
			}catch(exception){
				error("Exception when flattening json-ld text fields: "+exception.message)
			}
		}
	}
	
	if(first != undefined && first == false){
		return jsonLd;
	}else{
		return JSON.stringify(jsonLd)
	}
}