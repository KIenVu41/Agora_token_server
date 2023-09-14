var http = require("http");
var express = require("express");
var { RtcTokenBuilder, RtcRole } = require("agora-access-token");

var PORT = 8080;

var appID = "1f4bb349ea1641309a259d5716f6baec";
var appCertificate = "3fbe0eea20b4451d8d0d4dc281cd8f95";

var expirationTimeInSeconds = 3600;
var role = RtcRole.PUBLISHER;

var app = express();
app.disable("x-powered-by");
app.set("port", PORT);
app.use(express.json());

var generateRtcToken = function (req, resp) {
  var currentTimestamp = Math.floor(Date.now() / 1000);
  var privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
  var channelName = req.query.channelName;
  // use 0 if uid is not specified
  var uid = req.query.uid || 0;
  if (!channelName) {
    return resp.status(400).json({ error: "channel name is required" }).send();
  }

  var key = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  resp.header("Access-Control-Allow-Origin", "*");
  return resp.json({ key: key }).send();
};

app.get("/rtcToken", generateRtcToken);

http.createServer(app).listen(app.get("port"), function () {
  console.log("AgoraSignServer starts at " + app.get("port"));
});
