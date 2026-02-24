const axios = require("axios");
const qs = require("qs");

exports.handler = async function(context, event, callback) {
  const callback_url = `https://${context.DOMAIN_NAME}/send-email`;
  const recordingUrl = event.RecordingUrl;
  const recordingSid = event.RecordingSid;
  if (!recordingUrl) {
    return callback(null, "No recording");
  }

  const company_name = event.company_name;
  const voicemail_to = event.voicemail_to;

  console.log("Recording:", event.RecordingUrl);
  console.log("company_name:", company_name);
  console.log("voicemail_to:", voicemail_to);
  console.log("FULL EVENT: ", JSON.stringify(event))

  try{
    await axios.post(
    callback_url,
    qs.stringify({
      RecordingUrl: recordingUrl,
      RecordingSid: recordingSid,
      company_name: company_name,
      voicemail_to: voicemail_to,
      From: event.From,
      To: event.To,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      auth: {
        username: context.ACCOUNT_SID,
        password: context.AUTH_TOKEN
      }
    }
  );
    callback(null, "Success")
  } catch (error){
    console.error("Error: ", error);
    callback(error)
  }
};