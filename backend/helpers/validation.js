// Check email is valid
const isValidEmail = (email = '') => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(email?.trim());
}

const isValidEvmAddress = (evmAddress = '') => {
  const re = /^0x[0-9a-fA-F]{40}$/;

  return re.test(evmAddress?.trim());
}

const isValidBooleanNumber = (number = 0) => {
  const booleanNumbers = [0,1];

  return booleanNumbers.includes(number);
}

module.exports = {
  isValidEmail,
  isValidEvmAddress,
  isValidBooleanNumber,
};