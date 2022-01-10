require("dotenv").config();

const https = require("https");
const Logger = require("./logging");
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

        try {
            var req = https.get(options, (res) => {
                Logger.Log(`API sent response code: ${res.statusCode}`);
    
                var jsondata = '';
                    
                res.on('data', (chunk) => {
                    jsondata += chunk;
                });
    
                res.on('end', () => {
                    console.log(jsondata);
                    try {
                        jsondata = JSON.parse(jsondata);
                    } catch (e) {
                        Logger.Error(`Failed to parse API response! Error: ${e}`);

                        return;
                    }
    
                    if(cb) {
                        cb(jsondata, res.statusCode);
                    }
                });
            });
        } catch (e) {
            console.log(e);
        }
    },
    POST: (endpoint, data, cb = null) => {

    }
}