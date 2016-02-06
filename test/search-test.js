var assert = require('chai').assert;
var functions = require('../app/src/function.js');
var search = [];

suite('Tests', function() {

  setup(function() {
      search = ['astronaute','bassist','comedian'];
  });

  test('search should return the sublist filtered', function(done) {
      assert.equal(search.length, 3 , 'Wrong size of search values');
      assert.equal(functions.filterSearch(search, "as").length, 2, 'Wrong number of filtered values');
      done();
  });

  test('search for nothing should return the same array', function(done) {
      assert.equal(functions.filterSearch(search, "").length, 3, 'Wrong number of values');
      done();
  });

  test('search for unknown values should return an empty array', function(done) {
      assert.equal(functions.filterSearch(search, "zx@!").length, 0, 'Wrong number of values');
      done();
  });
});
