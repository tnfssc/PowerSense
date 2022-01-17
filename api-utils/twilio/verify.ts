import twilioClient from ".";

const VERIFICATION_SID = process.env.TWILIO_VERIFICATION_SID!;

const twilioVerify = twilioClient.verify.services(VERIFICATION_SID);

export default twilioVerify;
