import { Twilio } from "twilio";

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!;
const AUTH_TOKEN = process.env.TWILIO_AUTHTOKEN!;
const twilioClient = new Twilio(ACCOUNT_SID, AUTH_TOKEN);

export default twilioClient;
