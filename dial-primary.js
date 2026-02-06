exports.handler = function(context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();
  const company_name = event.company_name;
  const number_a = event.number_a;
  const number_b = event.number_b;

  const dial = twiml.dial({
    answerOnBridge: true,
    timeout: 10,
    action: `https://${context.DOMAIN_NAME}/dial-complete?number_b=${encodeURIComponent(number_b)}`,
    method: "POST"
  });

  dial.number(
    {
      url: `https://${context.DOMAIN_NAME}/whisper?company_name=${encodeURIComponent(company_name)}&number_b=${encodeURIComponent(number_b)}`
    },
    number_a
  );

  console.log("dial-primary");

  callback(null, twiml);
};
