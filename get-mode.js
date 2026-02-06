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

    return callback(null, { mode: item.data.mode });
  } catch (err) {
    console.error(err);
    return callback(null, { mode: "C" });
  }
};
