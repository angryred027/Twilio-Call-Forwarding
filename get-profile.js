exports.handler = async function(context, event, callback) {
  const client = context.getTwilioClient();
  const number = event.number;

  if(!number){
    console.log("Empty number");
    return callback(null, { error: "No number provided" });
  }

  console.log("Number: " + number)

  try {
    const item = await client.sync.v1
      .services(context.SYNC_SERVICE_SID)
      .syncMaps('numberProfiles')
      .syncMapItems(number)
      .fetch();

    return callback(null, {
      phone_number: number,
      friendly_name: item.data.friendly_name || null,
      carrier: item.data.carrier || null,
      company_name: item.data.company_name || null,
      location: item.data.location || null,
    });
  } catch (err) {
    console.error("Sync Map fetch error:", err);
    return callback(null, { error: "Number profile not found" });
  }
};
