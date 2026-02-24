exports.handler = async function(context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();

  const number_b = event.number_b;
  const record_call = event.record_call === "true";
  const company_name = event.company_name;
  const voicemail_to = event.voicemail_to;

  console.log("Dial-compete: ", event.From)

  let dialOptions = {
    answerOnBridge: true
  };
  if (record_call) {
    dialOptions.record = "record-from-answer-dual";
    dialOptions.recordingStatusCallback = `https://${context.DOMAIN_NAME}/recording-callback?company_name=${encodeURIComponent(company_name)}&voicemail_to=${encodeURIComponent(voicemail_to)}`;
    dialOptions.recordingStatusCallbackEvent = "completed";
    dialOptions.recordingStatusCallbackMethod = "POST";
  }
  const dial = twiml.dial(dialOptions);
  dial.number(number_b);

  callback(null, twiml);
};
