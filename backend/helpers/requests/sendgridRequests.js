const addOrUpdateContact = async (client, data) => {

  const request = {
    url: `/v3/marketing/contacts`,
    method: 'PUT',
    body: data
  }

  try {
    const [response, body] = await client.request(request)
    return { response, body }
  } catch (error) {
    throw error
  }
};

const getAllContacts = async (client) => {
  const request = {
    url: `/v3/marketing/contacts`,
    method: 'GET',
  }

  try {
    const [response, body] = await client.request(request)
    return { response, body }
  } catch (error) {
    throw error
  }
};

const getContactsByEmails = async (client, emails = []) => {
  console.log('emails', emails)
  const request = {
    url: `/v3/marketing/contacts/search/emails`,
    method: 'POST',
    body: { emails }
  }

  try {
    const [response, body] = await client.request(request)
    return { response, body }
  } catch (error) {
    throw error
  }
};

const getContactsByEvmAddress = async (client, evmAddress = '') => {
  console.log('evmAddress', evmAddress)

  const data = {
    "query": `lower(address_line_2) = '${evmAddress?.toLowerCase()}'`, // we use address_line_2 custom field as evm address
  };

  const request = {
    url: `/v3/marketing/contacts/search`,
    method: 'POST',
    body: data
  }

  try {
    const [response, body] = await client.request(request)
    return { response, body }
  } catch (error) {
    throw error
  }
};

module.exports = {
  addOrUpdateContact,
  getAllContacts,
  getContactsByEmails,
  getContactsByEvmAddress,
};