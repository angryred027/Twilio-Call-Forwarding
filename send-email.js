const nodemailer = require("nodemailer");
const axios = require("axios");

exports.handler = async function (context, event, callback) {
  console.log("Transcription callback hit");
  try {
    const company_name = event.company_name || "Unknown Company";
    const transcriptionText = event.TranscriptionText || "(No transcription)";
    const recordingUrl = event.RecordingUrl;

    console.log("Company Name; " + company_name);
    console.log("Transcription Text: " + transcriptionText);
    console.log("Recording URL: " + recordingUrl);

    if (!recordingUrl) {
      return callback(null, { error: "No RecordingUrl provided" });
    }

    const response = await axios.get(recordingUrl, {
      responseType: "arraybuffer",
      auth: {
        username: context.ACCOUNT_SID,
        password: context.AUTH_TOKEN,
      },
    });

    const audioBuffer = Buffer.from(response.data, "binary");

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: context.SMTP_USER,
        pass: context.SMTP_APP_PASSWORD,
      },
    });

    let mailOptions = {
      from: context.VOICEMAIL_FROM,
      to: context.VOICEMAIL_TO,
      cc: context.CC_EMAIL || context.VOICEMAIL_FROM,
      replyTo: context.VOICEMAIL_FROM,
      subject: `Voicemail from ${company_name}`,
      text: `From:\n${event.number || "(unknown)"}\n\nTranscription:\n${transcriptionText}`,
      attachments: [
        {
          filename: `${event.RecordingSid || "voicemail"}.wav`,
          content: audioBuffer,
          contentType: "audio/mpeg",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("Voicemail sent successfully!");
    return callback(null, "OK");
  } catch (err) {
    console.error("Error sending voicemail:", err);
    return callback(err);
  }
};


