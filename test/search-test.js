var assert = require('chai').assert;
var functions = require('../app/src/function.js');
var search = [];

suite('Tests', function() {

  setup(function() {
      search = [
        {
          title: 'astronaute',
          synopses: {
            small: 'zzzz'
          }
        },
        {
          title:'bassist',
          synopses: {
            small: ''
          }
        },
        {
          title:'comedian',
          synopses: {
            small: ''
          }
        }
      ];
  });

  test('search should return the sublist filtered', function(done) {
      assert.equal(search.length, 3 , 'Wrong size of search values');
      /*
      * here we expect one because bassist contains "as" but doesn't startsWith it !!
      */
      assert.equal(functions.filterSearch(search, "as").length, 1, 'Wrong number of filtered values');
      done();
  });

  test('search for nothing should return the same array', function(done) {
      assert.equal(functions.filterSearch(search, "").length, 3, 'Wrong number of values');
      done();
  });

  test('search for unknown values should return an empty array', function(done) {
      assert.equal(functions.filterSearch(search, "@!").length, 0, 'Wrong number of values');
      done();
  });

  test('search for values should be effective also on synopses', function(done) {
      assert.equal(functions.filterSearch(search, "z").length, 1, 'Wrong number of values');
      done();
  });
});
