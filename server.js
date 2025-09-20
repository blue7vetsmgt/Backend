require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const accountSid = "AC8bcbee1f54764d4b4c7f5f01a06efd29"; // Your Twilio Account SID
const authToken = "62aefb4d33cf8d866de9b5de3b377e91"; // Your Twilio Auth Token
const verifyServiceSid = "VA8422c7e6653411bd2aa0f8edb211f106"; // Insert your Verify Service SID here

const client = twilio(accountSid, authToken);

app.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone)
    return res
      .status(400)
      .json({ success: false, message: "Phone number required" });

  try {
    const verification = await client.verify
      .services(verifyServiceSid)
      .verifications.create({ to: `+91${phone}`, channel: "sms" }); // Adjust country code as needed

    if (verification.status === "pending") {
      res.json({ success: true, message: "OTP sent" });
    } else {
      res.json({ success: false, message: "Failed to send OTP" });
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp)
    return res
      .status(400)
      .json({ verified: false, message: "Phone and OTP required" });

  try {
    const verificationCheck = await client.verify
      .services(verifyServiceSid)
      .verificationChecks.create({ to: `+91${phone}`, code: otp }); // Adjust country code as needed

    if (verificationCheck.status === "approved") {
      res.json({ verified: true });
    } else {
      res.json({ verified: false });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ verified: false, message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Twilio OTP backend running on port ${PORT}`);
});

