exports.handler = function(context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();
  const company_name = event.company_name;
  const number_a = event.number_a;
  const number_b = event.number_b;
  const record_call = event.record_call === "true";
  const voicemail_to = event.voicemail_to;

  let dialOptions = {
    answerOnBridge: true,
    timeout: 10,
    action: `https://${context.DOMAIN_NAME}/dial-complete?number_b=${encodeURIComponent(number_b)}&record_call=${encodeURIComponent(record_call)}&company_name=${encodeURIComponent(company_name)}&voicemail_to=${encodeURIComponent(voicemail_to)}`,
    method: "POST"
  };
  if (record_call) {
    dialOptions.record = "record-from-answer-dual";
    dialOptions.recordingStatusCallback = `https://${context.DOMAIN_NAME}/recording-callback?company_name=${encodeURIComponent(company_name)}&voicemail_to=${encodeURIComponent(voicemail_to)}`;
    dialOptions.recordingStatusCallbackEvent = "completed";
    dialOptions.recordingStatusCallbackMethod = "POST";
  }

  const dial = twiml.dial(dialOptions);

  dial.number(
    {
      url: `https://${context.DOMAIN_NAME}/whisper?company_name=${encodeURIComponent(company_name)}&number_b=${encodeURIComponent(number_b)}`
    },
    number_a
  );

  console.log("dial-primary");

  callback(null, twiml);
};
