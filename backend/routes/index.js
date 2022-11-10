const express = require('express');
const geoip = require('geoip-lite');

const { getIP } = require('../helpers/utils');
const {
  isValidEmail,
  isValidEvmAddress,
  isValidBooleanNumber,
} = require('../helpers/validation')
const {
  getContactsByEmails,
  getContactsByEvmAddress,
  addOrUpdateContact,
} = require('../helpers/requests/sendgridRequests');
const {
  getTotalUsd,
} = require('../helpers/requests/denbankRequests');

const dotenv = require("dotenv");
const client = require('@sendgrid/client');

dotenv.config();

client.setApiKey(process.env.SENDGRID_API_KEY);


const router = express.Router();

router.get("/", (req, res) => {
  const ip = getIP(req);
  res.json({ message: "Hello world", ip });
});

router.get('/health-check', (req,res) => {
  const errors = [];
  // check database connectivity and any other staff you want here
  // add any errors in an array
  if (errors.length > 0) {
     return res.status(500).json({health: false, errors: errors});
  }
  return res.status(200).send({health: true});
});

router.get("/getContactByEmail", async (req, res) => {
  const { email } = req.query;

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email. Provide correct email."});
  }

  try {
    const actionResponse = await getContactsByEmails(client, [email]);
    const resStatus = actionResponse.response?.statusCode || 200;

    res.status(resStatus).json({ response: actionResponse.body })
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).json({
      message: error.message,
    });
  }
});

router.get("/check", async (req, res) => {
  const { address } = req.query;

  if (!isValidEvmAddress(address)) {
    return res.status(400).json({ message: "Can't check address. Provide correct evm address."});
  }

  try {
    const actionResponse = await getContactsByEvmAddress(client, address);
    const resStatus = actionResponse.response?.statusCode || 200;

    const hasAccount = actionResponse.body.result.length > 0;

    res.status(resStatus).json({ hasAccount })
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).json({
      message: error.message,
    });
  }
});

router.get("/debank", async (req, res) => {
  const { address } = req.query;

  if (!isValidEvmAddress(address)) {
    return res.status(400).json({ message: "Can't check address. Provide correct evm address."});
  }

  try {
    const addressTotalUsd = await getTotalUsd(address);

    res.status(200).json({ total_usd: addressTotalUsd });
  } catch (error) {
    console.log('Get total USD error: ', error);
    res.status(error?.code || error?.response?.status || 500).json({
      message: error.message,
    });
  }
});

router.put("/subscribe", async (req, res) => { // TODO: add existing user checker

  const { email = '', address = '', investmentOpportunities = 0, emailNews = 0 } =
    req.body;

  if (
    !isValidEmail(email)
    || !isValidEvmAddress(address)
    || !isValidBooleanNumber(investmentOpportunities)
    || !isValidBooleanNumber(emailNews)
  ) {
    return res.status(400).json({ message: "Can't subscribe. Provide full and correct information."});
  }

  const ip = getIP(req);

  const { country = '', city = '', region = '' } = geoip.lookup(ip) || {};

  const ONOUT_ORG_LIST_ID = "09aa490b-7435-4eba-b55d-cb6cc2891f42";

  let addressTotalUsd;

  try {
    addressTotalUsd = await getTotalUsd(address);
  } catch (error) {
    console.log('Get total USD error: ', error);
    addressTotalUsd = 0;
  }

  const data = {
    list_ids: [
      ONOUT_ORG_LIST_ID
    ],
    contacts: [
      {
        email,
        city,
        state_province_region: region,
        country,
        address_line_2: address, // we use this field in search contact by evm address
        custom_fields: {
          "e2_T": address, // Ethereum_Address
          "e8_N": investmentOpportunities, // investment_opportunities
          "e9_N": emailNews, // email_news
          "e10_N": addressTotalUsd // Total_Value_Of_Cryptocurrency_In_USD
        }
      }
    ]
  };

  try {
    const actionResponse = await addOrUpdateContact(client, data)
    const resStatus = actionResponse.response?.statusCode || 200;

    res.status(resStatus).json({statusText: "Successfully subscribed!"})
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).json({
      message: error.message,
    });
  }
});


module.exports = router;