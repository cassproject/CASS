const axios = require('axios');

async function detectLoginRecordRegressions()
{
	var elasticVersion = (await axios.get('http://localhost:9200')).data;
	var encryptedValues = await axios.get('http://localhost:9200/schema.cassproject.org.kbac.0.2.encryptedvalue/_search?version=true',{params:{size:10000,scroll:"1m"}});
	var output = [];
	for (var hit of encryptedValues.data.hits.hits)
	{
		let vmax = hit._version;
		try{
			let fullObject = null;
			if (elasticVersion.version.number.startsWith("7."))
				fullObject = await axios.get('http://localhost:9200/permanent/_doc/'+encodeURIComponent(hit._id)+'.');
			else
				fullObject = await axios.get('http://localhost:9200/permanent/permanent/'+encodeURIComponent(hit._id)+'.');
			output.push(fullObject.data); 
			let latestLen = JSON.stringify(fullObject.data).length;
			for (let i = 1;i <= vmax;i++)
			{
				let fullObject2 = null;
				if (elasticVersion.version.number.startsWith("7."))
					fullObject2 = await axios.get('http://localhost:9200/permanent/_doc/'+encodeURIComponent(hit._id)+'.'+i);
				else
					fullObject2 = await axios.get('http://localhost:9200/permanent/permanent/'+encodeURIComponent(hit._id)+'.'+i);
				output.push(fullObject2.data); 
				if (latestLen+200 < JSON.stringify(fullObject2.data).length)
				{
					console.log('http://localhost:9200/permanent/permanent/'+encodeURIComponent(hit._id)+'.'+i);
					console.log("Latest record length: " + (latestLen+200) + " < this version: " + JSON.stringify(fullObject.data).length)
					console.log("Latest record version: " + vmax);
					console.log("-----");
				}
			}
		}
		catch(ex)
		{
			//console.error(ex);
		}
	}
	console.log(output);
} 

detectLoginRecordRegressions();