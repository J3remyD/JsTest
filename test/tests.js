var assert = require('chai').assert;
var functions = require('../app/src/function.js');
var datas = [
  {
    title: 'astronaute',
    synopses: {
      small: 'zzzz'
    },
    categories: [
      'test',
      'series',
      'tv']
  },
  {
    title:'bassist',
    synopses: {
      small: ''
    },
    categories: [
      'tv show',
      'UK'
    ]
  },
  {
    title:'comedian',
    synopses: {
      small: ''
    },
    categories: [
      'UK movie',
      'film',
      'UK']
  }
];

suite('Search', function() {
  setup(function() {
      datas = datas;
  });

 /*
  *
  * SEARCH Titles or descriptions
  *
  */
  test('search should return the sublist filtered', function(done) {
      assert.equal(datas.length, 3 , 'Wrong size of search values');

      /* here we expect one because bassist contains "as" but doesn't startsWith it !! */
      assert.equal(functions.filterSearch(datas, "as").length, 1, 'Wrong number of filtered values');
      done();
  });

  test('search for nothing should return the same array', function(done) {
      assert.equal(functions.filterSearch(datas, "").length, 3, 'Wrong number of values');
      done();
  });

  test('search for unknown values should return an empty array', function(done) {
      assert.equal(functions.filterSearch(datas, "@!").length, 0, 'Wrong number of values');
      done();
  });

  test('search for values should be effective also on synopses', function(done) {
      assert.equal(functions.filterSearch(datas, "z").length, 1, 'Wrong number of values');
      done();
  });

  /*
   *
   * SEARCH Categories
   *
   */
   test('search wrong categories values should return nothing', function(done) {
       assert.equal(functions.filterCategories(datas, "x").length, 0, 'x categories should return empty array');
       assert.equal(functions.filterCategories(datas, "").length, 0, 'Wrong number of values');
       done();
   });

   test('search for unknown values should return an empty array', function(done) {
       assert.equal(functions.filterCategories(datas, "@!").length, 0, 'Wrong number of values');
       done();
   });

   test('search for values should be effective also on synopses', function(done) {
       assert.equal(functions.filterSearch(datas, "z").length, 1, 'Wrong number of values');
       done();
   });

});

suite('Categories', function() {
  setup(function() {
      datas = datas;

      Array.prototype.contains = function(obj) {
        var i = this.length;
        while (i--) {
          if (this[i] === obj) {
              return true;
          }
        }
        return false;
      }
  });

  /*
   *
   * SEARCH Categories
   *
   */
   test('search wrong categories values should return nothing', function(done) {
       assert.equal(functions.filterCategories(datas, "x").length, 0, 'x categories should return empty array');
       assert.equal(functions.filterCategories(datas, "").length, 0, 'Wrong number of values');
       done();
   });

   test('search for values [Astronaute] should return concerned categories and object', function(done) {
       var src="series";
       var res = functions.filterCategories(datas, src);
       assert.equal(res.length, 1, 'Wrong number of values');

       var obj = res[0];
       assert.equal(obj.title, "astronaute");
       assert.isTrue(obj.categories.contains(src));
       done();
   });

   test('search concatenate categories should return them both', function(done) {
       assert.equal(functions.filterCategories(datas, "tv;film").length, 2, 'wrong number of results');
       done();
   });

});
