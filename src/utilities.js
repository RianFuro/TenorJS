/**
 * @author Jinzulen
 * @license Apache 2.0
 * 
 * TenorJS - Lightweight NodeJS wrapper around the Tenor.com API.
 */

const HTTPS = require("https");

exports.callAPI = function (Path, Callback)
{
      try
      {
            HTTPS.get(Path, (Result) => {
                  let Error;
                  let rawData = "";

                  const Code = Result.statusCode;
                  const Type = Result.headers["content-type"];

                  if (Code !== 200)
                  {
                        Error = `# [TenorJS] Could not send request @ ${Path} - Status Code: ${Code}`;
                        Error.code = "ERR_REQ_SEND";
                  } else if (Type.indexOf("application/json") === -1) {
                        Error = `# [TenorJS] Content received isn't JSON. Type: ${Type}`;
                        Error.code = "ERR_RES_NOT";
                  }

                  if (Error)
                  {
                        Result.resume();
                        Callback(Error);
                        return;
                  };

                  Result.setEncoding("utf8");

                  Result.on("data", function (Buffer) {
                        rawData += Buffer;
                  });

                  Result.on("end", () => {
                        let Data = null,
                            Error = null;

                        try
                        {
                              Data = JSON.parse(JSON.stringify(rawData));


                        } catch (unusedError) {
                              Error = "# [TenorJS] Failed to parse retrieved JSON.";
                              Error.code = "ERR_JSON_PARSE";
                        };

                        Callback(Error, Data);
                  });
            });
      } catch (E) { throw E; };
};