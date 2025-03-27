import dotenv from 'dotenv'
dotenv.config();

// user password
//const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD
const STRIPE_SECRET_KEY = "sk_test_51R5oqiAOliERgcsVyRqwHR2Ff6loliU0xK52SPTkI7A27jz3BTJ5BdXtUPKu53pHwv84v67fOkOL5NMBBNsXZmsg00ItZfm39j";


export default {
  JWT_SECRET,
  JWT_ADMIN_PASSWORD,
  STRIPE_SECRET_KEY,
}