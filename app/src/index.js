'use strict';

var $ = require('jquery');
var _ = require('lodash');
var functions = require('./function.js');
var utilities = require('./utilities.js');

// Service const
var basePath = utilities.connectionPaths.basePath;
var pagePath = utilities.connectionPaths.pagePath;
var letter = utilities.defaultValues.defaultLetter;
var page = utilities.defaultValues.defaultPage;


// Input elements
var search = document.getElementById('search-input');
var categories = document.getElementById('categories-input');
var results = document.getElementById('results');
var alphabet = document.getElementById('alphabet');
var availability = document.getElementById('available');

var currentCount=-1;
var currentRows = [];
var per_page = -1;

var temp;

function init() {
 //  putAlphabet(utilities.alphabet);
  loadList(letter, page);
}

function checkAll() {
  Promise.resolve(currentRows)
  .then(triggerSearch)
  .then(triggerCategories)
  .then(triggerAvailability);
}

function intersection(a,b){
  var c=[];
   for(var m in a){
      for(var n in b){
         if((a[m].id==b[n].id)) {
            c.push(a[m]);
         }
      }}
    return c;
  }

function alphabetListener() {
  return function() {
    letter = alphabet.selectedItem.textContent.trim().toLowerCase();
    loadList(letter, page);
  };
}
function pagesListener() {
  return function() {
    var tab =  event.target;
    tab.style.fontWeight='bold';
    page = tab.textContent.trim().toLowerCase();
    loadList(letter, page);
    resetFilters();
  };
}

function resetFilters() {
  search.value ='';
  categories.value = '';
  availability.checked = true;
}


function loadList(letter, page) {
    return get(basePath + letter + pagePath + page).then(res=> {
        var progs = res.atoz_programmes;
          currentCount = progs.count;
          per_page = progs.per_page;
        currentRows = progs.elements;
        putResults(currentRows);
        putPages(Math.ceil(currentCount / per_page));
    });
}

function triggerSearch(letter, page) {
    var filteredRows = functions.filterSearch(currentRows, getSearchValue().toLowerCase());
    temp = filteredRows;
    putResults(filteredRows);
}

function searchListener() {
  return function(){
    checkAll();
  };
}
/*
  @return the content of the search element as a string
*/
function getSearchValue() {
  return search.value;
}

/*
  Build a listener on the categories element
  @return a function that should react on user-input
*/
function categoriesListener() {
  return function(){
    checkAll();
  };
}

function triggerCategories() {
    var filteredRows = functions.filterCategories(currentRows, getCategoriesValue().toLowerCase()) || [];
    temp = filteredRows.length  === 0 && temp.length > 0 ? temp : intersection(temp, filteredRows);
    putResults(temp);
}

/*
  @return the content of the categories element as a string
*/
function getCategoriesValue() {
  return categories.value;
}

function availabilityListener() {
  return function(){
    checkAll();
  };
}

function triggerAvailability() {
    var filteredRows = functions.filterAvailability(currentRows, getAvailabilityValue()) || [];
    temp = intersection(temp, filteredRows);
    putResults(temp);
}

function getAvailabilityValue() {
  return availability.checked;
}

/*
  Set the text content of the result panel
  @param res a string
*/
function putResult(res) {
  results.textContent = res;
}

/*
//to replace hard coded listbox

function putAlphabet(letters) {
  alphabet.innerHTML = '' + _.forEach(letters, r =>
    `<paper-item>${r}</paper-item>`)
    .join('') + '';
}*/

/*
  Set the content of the result panel
  @param res an array of string representing fetched datas
*/
function putResults(res) {
  results.innerHTML = res.length === 0 ? 'No result found matching your filters' : '<ul style="list-style-type: none;">' + _.map(res, r =>
    `<li style="float:left; position:relative">
      <div style="display:inline-block;  float:left;  ">
        <h3>${r.title} | <i style="color: #4caf50">${r.status} </i></h3>
        <b>type:</b> ${r.tleo_type} | <b>television:</b> ${r.type}
        <br>
        <b>Categories:</b> ${r.categories}
        <br>
        <i>
          <b>Summary:</b>
          <br>
          ${r.synopses.small}
        </i>
      </div>
      <div style="display:inline-block; float:right; padding: 20 0 0 20 ">
        <img style="display:inline-block; position:absolute" src='${r.images.standard}'/>
      </div>
    <br><br>
    </li>`).join('') + '</ul>';
}

function putPages (nbPages) {
  pages.innerHTML = '' + _.times(nbPages, r =>
    `<paper-item class="page">${r+1}</paper-item>`)
    .join('') + '';
}

/*
  Helper method for GET requests using jquery ajax library
  @return a native Promise
*/
function get(url) {
  return Promise.resolve($.get(url));
}

//listeners
search.addEventListener('input', searchListener());
categories.addEventListener('input', categoriesListener());
alphabet.addEventListener('click', alphabetListener());
pages.addEventListener('click', pagesListener());
availability.addEventListener('change', availabilityListener());

window.onLoad=init();
