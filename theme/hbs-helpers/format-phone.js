const { SafeString } = require('handlebars');

const formatPhoneDisplay = (phone) => {
  if (!phone) {
    return '';
  }

  const formatted = phone
    .replace(/ /g, '&nbsp;')
    .replace(/-/g, '&#8209;');

  return new SafeString(formatted);
};

module.exports = { formatPhoneDisplay };
