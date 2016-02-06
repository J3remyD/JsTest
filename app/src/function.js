var exports = module.exports = {};

exports.filterSearch = function filterSearch(res, src) {
  return res.filter(
      function (el) {
          var b = el.title.toLowerCase().startsWith(src);
          var b2 = el.synopses.small.toLowerCase().includes(src);
          return (b || b2);
     });
}

exports.filterCategories = function filterCategories(res, src) {
  var inputCategories = src.split(';');
  return res.filter(function (el) {
    for (var i = 0; i < inputCategories.length; i++) {
        if(el.categories.indexOf(inputCategories[i]) != -1) {
          return true;
        }
     }
   });
}

exports.filterAvailability = function filterAvailability(res, checked) {
  return res.filter(
      function (el) {
          return checked ? el.status === 'available' : el.status !== 'available';
     });
}
