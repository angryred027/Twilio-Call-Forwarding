exports.handler = function(context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();

  const company_name = event.company_name;
  const number_b = event.number_b;
  console.log("whisper");


  const gather = twiml.gather({
    input: 'dtmf',
    numDigits: 1,
    timeout: 7,
    action: `https://${context.DOMAIN_NAME}/confirm-accept?number_b=${encodeURIComponent(number_b)}&callSid=${event.CallSid}`,
    method: "POST"
  });

  gather.say(`Call from ${company_name}. Press 1 to accept.`);
  twiml.pause({ length: 3 })
  gather.say(`Call from ${company_name}. Press 1 to accept.`);
  twiml.hangup();

  callback(null, twiml);
};
