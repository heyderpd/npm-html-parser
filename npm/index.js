'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * html-parse-regex
 * Copyright (c) 2016 heyderpd <heyderpd@gmail.com>
 * ISC Licensed
 */

var createMatch = function createMatch(tag, startPoint, result, Pattern) {
  return {
    tag: tag,
    link: { up: [], down: [], out: [], in: [] },
    string: {
      start: startPoint + result.index,
      end: startPoint + Pattern.lastIndex
    }
  };
};

var getGroups = function getGroups(result) {
  return {
    tag: result[2] !== undefined ? result[2] : null,
    params: result[3] !== undefined ? result[3] : null,
    innerHtml: result[4]
  };
};

var parseData = function parseData(text) {
  var startPoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var R = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  if (!text) {
    return '';
  }
  if (typeof text !== 'string') {
    throw "Try Parse Object as a String";
  }
  if (R++ > 42) {
    throw "Limit recursive exceeded in f.parseData";
  }

  var Pattern = new RegExp(tagParse, "gim");
  var inner = [];
  var result = null;

  var _loop = function _loop() {
    var _getGroups = getGroups(result),
        tag = _getGroups.tag,
        params = _getGroups.params,
        innerHtml = _getGroups.innerHtml;
    // push to data.Objs


    var Match = createMatch(tag, startPoint, result, Pattern);
    var refPoint = Match.string.start + 1 + (typeof result[1] === 'string' ? result[1].length : 0);
    // push to data.List
    data.List.push(Match);
    inner.push(Match);
    // create inner node's
    Match.inner = parseData(innerHtml, refPoint, R);
    // link node's
    if (_typeof(Match.inner) === 'object') {
      map(function (nodo) {
        if (nodo) {
          Match.link.down.push(nodo);
          nodo.link.up.push(Match);
        }
      }, Match.inner);
    }
    // create params
    Match.params = getTagParams(params);
    // push to data.ids
    if (Match.params.id) {
      data.map.id[Match.params.id] = Match;
    }
  };

  while ((result = Pattern.exec(text)) !== null) {
    _loop();
  }
  if (inner.length) return inner;else return text;
};

var getTagParams = function getTagParams(text) {
  var Pattern = new RegExp(paramParse, "gim");
  var params = {};
  var result = null;
  while ((result = Pattern.exec(text)) !== null) {
    var key = result[1];
    var value = result[3];
    if (key) params[key.toLowerCase()] = value ? value.toLowerCase() : undefined;
  }
  return params;
};

var main = function main(html) {
  // verify input
  if (html === undefined) {
    throw 'param "html" is undefined';
  }
  // initialize
  var start = void 0,
      crono = void 0;
  if (debug) {
    start = +new Date();
  }
  data = {
    file: html,
    map: { id: {} },
    List: [],
    Objs: {},
    state: { resume: {}, ready: false }
  };
  data.Objs = parseData(html);
  data.ready = true;
  if (debug) {
    crono = (+new Date() - start) / 1000;
  }
  return data;
};

function getResume() {
  /*   */
}

var _require = require('pytils'),
    map = _require.map;

var tagParse = "[\r\n\t ]*(<\\??([^ =>]+)([^>]*?))(?:\\/>|>([\\w\\W]+?)(?:<\\/\\2>)|>)\n?";
var paramParse = "(?:([^ ?=]+))(?:=([\"])((?:\\\\\\2|.)+?)(?:\\2))?";

var data = { ready: false };
var debug = false;

module.exports = {
  parse: main,
  resume: getResume
};
