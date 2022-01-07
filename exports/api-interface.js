require("dotenv").config();

const https = require("https");

const link = process.env.APILINK;

module.exports = {
    GET: (endpoint, cb = null) => {
        let options = {
            hostname: link,
            path: `/${endpoint}`,
            headers: {
                'X-Api-Key': process.env.APIKEY
            }
        }

        var req = https.get(options, (res) => {
            console.log("[API] Got response code: " + res.statusCode);

            var jsondata = '';
                
            res.on('data', (chunk) => {
                jsondata += chunk;
            });

            res.on('end', () => {
                jsondata = JSON.parse(jsondata);

                if(cb) {
                    cb(jsondata);
                }
            });
	    });
    },
    POST: (endpoint, data, cb = null) => {

    }
}