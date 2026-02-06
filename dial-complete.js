exports.handler = async function(context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();

  const number_b = event.number_b;

  const dial = twiml.dial({
    answerOnBridge: true
  });

  dial.number(number_b);

  callback(null, twiml);
};
