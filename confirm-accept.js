exports.handler = async function(context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();
  console.log("cofirm-accept");
  if (event.Digits === '1') {
    twiml.say('Connecting now.');
    console.log("Connected to number A.");
    callback(null, twiml);
  }

  callback(null, twiml);
};
