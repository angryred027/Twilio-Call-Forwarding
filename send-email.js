const nodemailer = require("nodemailer");
const axios = require("axios");

exports.handler = async function (context, event, callback) {
  try {
    const company_name = event.company_name || "Unknown Company";
    const transcriptionText = event.TranscriptionText;
    const hasTranscription =
      transcriptionText && transcriptionText.trim().length > 0;
    const recordingUrl = event.RecordingUrl;
    const caller_number = event.From;
    const callee_number = event.To;
    const voicemail_to = event.voicemail_to;
    console.log("Send email to: ", voicemail_to);
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

    const parts = [];

    if (caller_number) {
      parts.push(`From:\n${caller_number}`);
    }

    if (callee_number) {
      parts.push(`To:\n${callee_number}`);
    }

    if (hasTranscription && transcriptionText) {
      parts.push(`Transcription:\n${transcriptionText}`);
    }

    const text = parts.join("\n\n");
    let mailOptions = {
      from: context.VOICEMAIL_FROM,
      to: voicemail_to,
      cc: context.CC_EMAIL || context.VOICEMAIL_FROM,
      replyTo: context.VOICEMAIL_FROM,
      subject: `Voicemail from ${company_name}`,
      text: text,
      attachments: [
        {
          filename: `${event.RecordingSid || "voicemail"}.wav`,
          content: audioBuffer,
          contentType: "audio/wav",
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
