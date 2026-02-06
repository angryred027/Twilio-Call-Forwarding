exports.handler = function(context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();
  const number_b = event.number_b;
  console.log("failover");
  const dial = twiml.dial({ timeout: 10 });
  dial.number(number_b);

  callback(null, twiml);
};
