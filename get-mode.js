exports.handler = async function(context, event, callback) {
  const client = context.getTwilioClient();

  if(!event.number){
    console.log("Empty number");
    return callback(null, { mode: "C" });
  }

  try {
    const item = await client.sync.v1
      .services(context.SYNC_SERVICE_SID)
      .syncMaps('numberModes')
      .syncMapItems(event.number)
      .fetch();

    console.log(event.number)
    console.log("Mode: " + item.data.mode)

    return callback(null, { 
      mode: item.data.mode, 
      number_a: item.data.number_a, 
      number_b: item.data.number_b, 
      voicemail_to: item.data.owner_email,
      record_call: item.data.record_call,
      language: item.data.language,
    });
  } catch (err) {
    console.error(err);
    return callback(null, { mode: "C" });
  }
};
