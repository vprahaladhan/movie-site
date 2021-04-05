/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "movieId": () => (/* binding */ movieId),
/* harmony export */   "tmdbSession": () => (/* binding */ tmdbSession),
/* harmony export */   "currentPage": () => (/* binding */ currentPage),
/* harmony export */   "totalPages": () => (/* binding */ totalPages),
/* harmony export */   "totalResults": () => (/* binding */ totalResults),
/* harmony export */   "setCurrentPage": () => (/* binding */ setCurrentPage),
/* harmony export */   "getTMDBSession": () => (/* binding */ getTMDBSession),
/* harmony export */   "getMovieVoteCount": () => (/* binding */ getMovieVoteCount),
/* harmony export */   "getMovieTrailerURL": () => (/* binding */ getMovieTrailerURL),
/* harmony export */   "clearMovieSearch": () => (/* binding */ clearMovieSearch),
/* harmony export */   "trailerClickEventListener": () => (/* binding */ trailerClickEventListener),
/* harmony export */   "displayMovieDetailsModal": () => (/* binding */ displayMovieDetailsModal),
/* harmony export */   "createMovieSlide": () => (/* binding */ createMovieSlide),
/* harmony export */   "fetchMovies": () => (/* binding */ fetchMovies),
/* harmony export */   "postMovieRating": () => (/* binding */ postMovieRating)
/* harmony export */ });
/* harmony import */ var _styles_index_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _assets_no_image_jpg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);




let movieId;
let tmdbSession = {};
let currentPage = 1;
let totalPages, totalResults;

const setCurrentPage = pageNo => {
  currentPage = pageNo
  return currentPage; 
};

const getTMDBSession = () => {
  return fetch(`${_constants__WEBPACK_IMPORTED_MODULE_1__.theMovieDBURL}/authentication/guest_session/new?api_key=${_constants__WEBPACK_IMPORTED_MODULE_1__.api_key}`)
    .then(response => {
      console.log('Response : session > ', response);
      return response.json()
    })
    .then(result => tmdbSession = result.success && {
      session_id: result.guest_session_id,
      expires_at: new Date(result.expires_at)
    });
};

const getMovieVoteCount = movieId => {
  return fetch(`${_constants__WEBPACK_IMPORTED_MODULE_1__.movieTrailerBaseURL}/${movieId}?api_key=${_constants__WEBPACK_IMPORTED_MODULE_1__.api_key}`)
    .then(response => response.json())
    .then(movie => {
      console.log('Movie vote count >> ', movie.vote_count);
      return movie.vote_count
    });
}

const getMovieTrailerURL = movieId => {
  return `${_constants__WEBPACK_IMPORTED_MODULE_1__.movieTrailerBaseURL}/${movieId}/videos?api_key=${_constants__WEBPACK_IMPORTED_MODULE_1__.api_key}&${_constants__WEBPACK_IMPORTED_MODULE_1__.language}`;
}

const clearMovieSearch = () => {
  const newMovieSearchDiv = document.createElement('div');
  newMovieSearchDiv.id = 'movie-search';
  newMovieSearchDiv.className = 'slick';
  newMovieSearchDiv.style = 'width: 90%; margin: 0 auto;'
  document.getElementById('movie-search').replaceWith(newMovieSearchDiv);
};

const trailerClickEventListener = () => {
  console.log('Movie ID > ', movieId);
  fetch(getMovieTrailerURL(movieId))
    .then(response => response.json())
    .then(({ results }) => {
      if (results.length !== 0 && results[0].site.toLowerCase() === 'youtube') {
        document.getElementById('movie-poster-container').innerHTML = `
          <iframe 
            id="youtube-trailer"
            width="400px" 
            height="400px"
            src="${_constants__WEBPACK_IMPORTED_MODULE_1__.youtubeTrailerURL}/${results[0].key}?autoplay=1">
          </iframe>
        `;
        document.getElementById('trailer').disabled = true;
      }
      else {
        alert('Sorry, No trailers available for the movie!')
      }
    });
};

const displayMovieDetailsModal = (event, movie) => {
  document.getElementById('movie-title').innerHTML = movie.title;
  document.getElementById('movie-poster').src = movie.poster_path ? _constants__WEBPACK_IMPORTED_MODULE_1__.moviePosterURL + movie.poster_path : _assets_no_image_jpg__WEBPACK_IMPORTED_MODULE_2__;
  document.getElementById('movie-poster').alt = movie.title;
  document.getElementById('movie-overview').innerHTML = movie.overview;
  document.getElementById('release-date').innerHTML = `Released: ${movie.release_date}`;
  document.getElementById('average-vote').innerHTML = `Avg. vote: ${movie.vote_average}`;

  if (document.getElementById(`like-${movie.id}`).className.includes('liked')) {
    document.getElementById('like-icon').classList.add('liked');
  }

  document.getElementById('like-icon').onclick = () => {
    document.getElementById('like-icon').classList.toggle('liked');
    document.getElementById(`like-${movie.id}`).classList.toggle('liked');
  };

  movieId = movie.id;
  document.getElementById('trailer').addEventListener('click', trailerClickEventListener);
};

const createMovieSlide = movie => {
  const movieContainer = document.createElement('div');
  const movieInnerContainer = document.createElement('div');
  movieInnerContainer.className = 'container';

  const trailer = document.createElement('button');
  trailer.setAttribute('data-toggle', 'modal');
  trailer.style = 'border: 0; background: none; border-radius: 0px; cursor: pointer;'

  const moviePoster = document.createElement('img');
  moviePoster.src = movie.poster_path ? _constants__WEBPACK_IMPORTED_MODULE_1__.movieImageURL + movie.poster_path : _assets_no_image_jpg__WEBPACK_IMPORTED_MODULE_2__;
  moviePoster.alt = movie.title;
  
  const likeIcon = document.createElement('div');
  likeIcon.id = `like-${movie.id}`;
  likeIcon.className = "btn btn-floating icon";
  likeIcon.innerHTML = '<i class="fa fa-heart"></i>';

  trailer.appendChild(moviePoster);
  trailer.appendChild(likeIcon);
  movieInnerContainer.appendChild(trailer);
  movieContainer.appendChild(movieInnerContainer);

  trailer.addEventListener('click', event => {
    trailer.setAttribute('data-target', '#movie-details-modal');
    if (document.getElementById('trailer').disabled) {
      document.getElementById('trailer').disabled = false;
    };
    displayMovieDetailsModal(event, movie);
  });

  likeIcon.addEventListener('click', event => {
    event.stopPropagation();
    likeIcon.classList.toggle('liked');
  });

  return movieContainer;
}

const fetchMovies = (url, category) => fetch(url)
  .then(response => response.json())
  .then(response => {
    if (category === 'search') {
      currentPage = response.page;
      totalPages = response.total_pages;
      totalResults = response.total_results;
    };

    response.results.forEach(movie => {
      let searchByCategory = '';
      switch (category) {
        case 'search': searchByCategory = 'movie-search'; break;
        case 'rated': searchByCategory = 'top-rated'; break;
        case 'popular': searchByCategory = 'most-popular'; break;
      }
      document.getElementById(searchByCategory).appendChild(createMovieSlide(movie));
    });
  });

const postMovieRating = rating => {
  fetch(`${_constants__WEBPACK_IMPORTED_MODULE_1__.movieTrailerBaseURL}/${movieId}/rating?api_key=${_constants__WEBPACK_IMPORTED_MODULE_1__.api_key}&guest_session_id=${tmdbSession.session_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      value: rating
    })
  }).then(response => response.json())
    .then(result => {
      if (result.success) {
        document.getElementById('movie-rating').value = '';
        document.getElementById('rating-success-msg').className = 'show';
        setTimeout(() => {
          document.getElementById('rating-success-msg').className = 'hide';
        }, 2000);
      };
    });
};

getTMDBSession();

fetchMovies(_constants__WEBPACK_IMPORTED_MODULE_1__.popularMoviesURL, 'popular');

fetchMovies(_constants__WEBPACK_IMPORTED_MODULE_1__.topRatedMoviesURL, 'rated');

/***/ }),
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 3 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "body {\r\n  margin-left: 10px;\r\n}\r\n\r\n.slick-prev:before, .slick-next:before {\r\n  color: blue;\r\n}\r\n\r\n.slick-active {\r\n  text-align: center;\r\n}\r\n\r\n.modal-footer {\r\n  padding: 15px;\r\n  text-align: center;\r\n  border-top: 1px solid #e5e5e5;\r\n}\r\n\r\n.quick{\r\n  position: absolute;\r\n  left:0;\r\n  right:0;    \r\n  margin-top:-75%;\r\n  padding:0 5%;\r\n  width:100%;\r\n  background:blue;\r\n  display:none;\r\n}\r\n\r\n/* .outer:hover img{\r\n  border: 1px solid blue;\r\n}\r\n\r\n.outer:hover .quick{\r\n  display:block;\r\n} */\r\n\r\n/* Container needed to position the overlay. Adjust the width as needed */\r\n.container {\r\n  position: relative;\r\n  width: 100%;\r\n  max-width: 400px;\r\n  padding-right: 5px;\r\n  padding-left: 5px;\r\n}\r\n\r\n.container button {\r\n  padding-right: unset;\r\n  padding-left: unset;\r\n}\r\n\r\n/* Make the image to responsive */\r\n.image {\r\n  width: 100%;\r\n  height: auto;\r\n}\r\n\r\n/* The overlay effect (full height and width) - lays on top of the container and over the image */\r\n.overlay {\r\n  position: absolute;\r\n  top: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n  right: 0;\r\n  height: 100%;\r\n  width: 100%;\r\n  opacity: 1;\r\n  transition: .3s ease;\r\n}\r\n\r\n/* When you mouse over the container, fade in the overlay icon*/\r\n/* .container:hover .overlay {\r\n  opacity: 1;\r\n} */\r\n\r\n/* The icon inside the overlay is positioned in the middle vertically and horizontally */\r\n.icon {\r\n  color: white;\r\n  font-size: 20px;\r\n  border-radius: 50%;\r\n  background: none;\r\n  position: absolute;\r\n  top: 8%;\r\n  left: 80%;\r\n  transform: translate(-50%, -50%);\r\n  -ms-transform: translate(-50%, -50%);\r\n  text-align: center;\r\n}\r\n\r\n/* When you move the mouse over the icon, change color */\r\n.liked {\r\n  color: rgba(255, 182, 194, 0.849);\r\n}\r\n\r\n/* .fa-heart:hover {\r\n  color: rgba(255, 182, 194, 0.849);\r\n} */\r\n\r\n.liked {\r\n  color: pink;\r\n}\r\n\r\n.unliked {\r\n  color: white;\r\n}\r\n\r\na:active, a:focus, a:visited {\r\n  outline: none;\r\n  text-decoration: none;\r\n  box-shadow: none;\r\n  border: none;\r\n  -moz-outline-style: none;\r\n}\r\n\r\n.btn.active.focus, .btn.active:focus, .btn.focus, .btn:active.focus, .btn:active:focus, .btn:focus {\r\n  outline: none;\r\n}\r\n\r\n.show {\r\n  display: block;\r\n}\r\n\r\n.hide {\r\n  display: none;\r\n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 4 */
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "api_key": () => (/* binding */ api_key),
/* harmony export */   "language": () => (/* binding */ language),
/* harmony export */   "theMovieDBURL": () => (/* binding */ theMovieDBURL),
/* harmony export */   "searchMoviesURL": () => (/* binding */ searchMoviesURL),
/* harmony export */   "popularMoviesURL": () => (/* binding */ popularMoviesURL),
/* harmony export */   "topRatedMoviesURL": () => (/* binding */ topRatedMoviesURL),
/* harmony export */   "movieTrailerBaseURL": () => (/* binding */ movieTrailerBaseURL),
/* harmony export */   "movieImageURL": () => (/* binding */ movieImageURL),
/* harmony export */   "moviePosterURL": () => (/* binding */ moviePosterURL),
/* harmony export */   "youtubeTrailerURL": () => (/* binding */ youtubeTrailerURL)
/* harmony export */ });
const api_key = "a2f05c95df66faa065b61cb42aae2c43";
const language = 'language=en-US';

const theMovieDBURL = 'https://api.themoviedb.org/3';
const searchMoviesURL = `${theMovieDBURL}/search/movie?api_key=${api_key}&${language}&include_adult=false`;
const popularMoviesURL = `${theMovieDBURL}/movie/popular?api_key=${api_key}&${language}&page=1`;
const topRatedMoviesURL = `${theMovieDBURL}/movie/top_rated?api_key=${api_key}&${language}&page=1`;
const movieTrailerBaseURL = `${theMovieDBURL}/movie`;
const movieImageURL = 'https://image.tmdb.org/t/p/w185';
const moviePosterURL = 'https://image.tmdb.org/t/p/w342';
const youtubeTrailerURL = 'https://www.youtube.com/embed';

/***/ }),
/* 6 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "f1982b89a5bcdd4c0fc1.jpg";

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);


let keyword;

document.getElementById('modal-close').onclick = () => {
  if (document.getElementById('youtube-trailer')) {
    document.getElementById('movie-poster-container').innerHTML = `
      <p><img id="movie-poster" src="#" alt="Movie Poster"></p>`;
  };
};

document.getElementById('search-button').addEventListener('click', () => {
  (0,_index__WEBPACK_IMPORTED_MODULE_0__.clearMovieSearch)();
  keyword = document.getElementById('search-keyword').value;
  (0,_index__WEBPACK_IMPORTED_MODULE_0__.setCurrentPage)(1);

  if (document.getElementById('search-keyword').value.length >= 1) {
    (0,_index__WEBPACK_IMPORTED_MODULE_0__.fetchMovies)(`${_constants__WEBPACK_IMPORTED_MODULE_1__.searchMoviesURL}&query=${keyword}&page=${_index__WEBPACK_IMPORTED_MODULE_0__.currentPage}`, 'search')
      .then(() => {
        initializeSlick();
        document.getElementById('search-keyword').value = '';
      });
  };
});

document.getElementById('movie-rating').addEventListener('input', () => {
  const rating = Number(document.getElementById('movie-rating').value);

  if (isNaN(rating) || rating < 0.5 || rating > 10.0) {
    document.getElementById('submit-rating').disabled = true;
  }
  else document.getElementById('submit-rating').disabled = false;
});

document.getElementById('submit-rating').addEventListener('click', () => {
  const rating = Number(document.getElementById('movie-rating').value);
  if (_index__WEBPACK_IMPORTED_MODULE_0__.tmdbSession.session_id && _index__WEBPACK_IMPORTED_MODULE_0__.tmdbSession.expires_at > new Date()) {
    (0,_index__WEBPACK_IMPORTED_MODULE_0__.postMovieRating)(rating);
  }
  else {
    (0,_index__WEBPACK_IMPORTED_MODULE_0__.getTMDBSession)()
      .then(() => (0,_index__WEBPACK_IMPORTED_MODULE_0__.postMovieRating)(rating))
  };
});

const initializeSlick = () => {
  $('#movie-search').slick({
    slidesToShow: 5,
    slidesToScroll: 5,
    arrows: true,
    lazyLoad: 'ondemand',
    infinite: true,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          dots: true
        }
      },
      {
        breakpoint: 884,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          dots: false
        }
      },
      {
        breakpoint: 650,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: false
        }
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false
        }
      }
    ]
  });

  $('#movie-search').on('beforeChange', (event, slick, currentSlide, nextSlide) => {
    const slidesToShow = $('#movie-search').slick('slickGetOption', 'slidesToShow') * 2;
    if (currentSlide === (_index__WEBPACK_IMPORTED_MODULE_0__.currentPage * 20 - slidesToShow)) {
      fetch(`${_constants__WEBPACK_IMPORTED_MODULE_1__.searchMoviesURL}&query=${keyword}&page=${(0,_index__WEBPACK_IMPORTED_MODULE_0__.setCurrentPage)(_index__WEBPACK_IMPORTED_MODULE_0__.currentPage + 1)}`)
        .then(response => response.json())
        .then(({ results }) => results.forEach(movie => {
          $('#movie-search').slick('slickAdd', (0,_index__WEBPACK_IMPORTED_MODULE_0__.createMovieSlide)(movie));
        }));
    }
  });
};

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	__webpack_require__(0);
/******/ 	var __webpack_exports__ = __webpack_require__(7);
/******/ 	
/******/ })()
;