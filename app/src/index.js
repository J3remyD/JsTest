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
  putAlphabet(utilities.alphabet);
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
    letter = event.target.textContent.trim().toLowerCase();
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

        var maxPage = Math.ceil(currentCount / per_page);
        if(maxPage < parseInt(page)) {
          page = maxPage;
          loadList(letter, page);
        } else {
          putResults(currentRows);
          putPages(maxPage);
        }

        var beginRow = (page - 1) * per_page;
        var endRow = Math.min(page * per_page, currentCount);
        countRows.innerHTML = 'Results rows : '+ beginRow + ' - ' + endRow + ' were fetched ' + ' | Page ' + page;
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


function putAlphabet(letters) {
  alphabet.innerHTML = '<ul class="list-generated">' + _.map(letters, r =>
    `<li class="letter">
        <paper-item >${r}</paper-item>
    </li>`).join('') + '</ul>';
}

/*
  Set the content of the result panel
  @param res an array of string representing fetched datas
*/
function putResults(res) {
    var computedRes = '<div class="cards">' + _.map(res, r =>
      `<style is="custom-style">
          #card-content {
            @apply(--layout-vertical);
            @apply(--layout-wrap);
          }

          #card-content > paper-card {
            box-sizing: border-box;
            margin: 4px;
            flex: 0 0 auto;

          }

          .card-content {
            min-width: 300px;
            min-height:156px;
          }

          .card-header {
            @apply(--paper-font-headline);
            font-size:16px;
          }
          .card-light {
            color: var(--paper-grey-600);
            max-width: 250px;
            font-size: 12px;
          }
          .card-location {
            float: right;
            font-size: 14px;
            vertical-align: middle;
          }

          .cats {
            font-size: 14px;
            color: var(--paper-grey-600);
          }

          .summary {
            text-align: justify;
            font-size: 14px;
            margin-top: 10px;
          }
        </style>
        <paper-card id="img" image="${r.images.standard}">
        <div id="card-content" class="card-content">
        <div class="card-location card-light">
          <span>${r.status}</span>
        </div>
        <div class="card-header">${r.title}</div>
          <p class="cats">Format: ${r.tleo_type} <br> Type: ${r.type}</p>
          <i class="cats">Categories: ${r.categories}</i>
          <div class="summary">
          <i>Summary</i> <br>
            ${r.synopses.small}
          </div>
        </div>
        </paper-card>
      `).join('') + '</div>';
    results.innerHTML = res.length === 0 ? 'No results found matching your filters' : computedRes.replaceAll(utilities.recipes.pattern,
    utilities.recipes.sizes.small);
}

String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
};

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
