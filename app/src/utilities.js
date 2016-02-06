var exports = module.exports = {};

// URI const
var BASE_URI = 'https://ibl.api.bbci.co.uk';
var DIR = '/ibl/v1/atoz/';
var basePath = BASE_URI + DIR;
var pagePath = '/programmes?page=';

// values
var defaultLetter ='a';
var defaultPage='1';

exports.connectionPaths = {
  basePath : basePath,
  pagePath : pagePath
}

exports.defaultValues = {
  defaultLetter: defaultLetter,
  defaultPage: defaultPage
}

exports.alphabet = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ]
