const { SafeString } = require('handlebars');
const markdown = require('markdown-it')();

const paragraphSplit = (text) => {
  if (text == null) {
    return new SafeString('');
  }

  const renderedText = markdown.render(text);
  return new SafeString(renderedText);
};

module.exports = { paragraphSplit };
