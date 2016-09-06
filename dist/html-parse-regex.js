'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*!
 * html-parse-regex
 * Copyright (c) 2016 heyderpd <heyderpd@gmail.com>
 * ISC Licensed
 */

function parseData(Text) {
  var startPoint = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  var R = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

  if (!Text) return '';
  if (typeof Text !== 'string') throw "Try Parse Object as a String";
  if (R++ > 42) throw "Limit recursive exceeded in f.parseData";

  var Pattern = new RegExp(tagParse, "gim");
  var inner = [];
  var result = null;

  var _loop = function _loop() {
    var tag = result[2] === undefined ? null : result[2];
    var params = result[3] === undefined ? null : result[3];
    var innerHtml = result[4];
    // push to data.Objs
    var Math = {
      tag: tag,
      link: { up: [], down: [], out: [], in: [] },
      string: {
        start: startPoint + result.index,
        end: startPoint + Pattern.lastIndex
      }
    };
    var refPoint = Math.string.start + 1 + (typeof result[1] === 'string' ? result[1].length : 0);
    // push to data.List
    data.List.push(Math);
    inner.push(Math);
    // create inner node's
    Math.inner = parseData(innerHtml, refPoint, R);
    if (_typeof(Math.inner) === 'object') doEach(Math.inner, function (nodo) {
      if (nodo) {
        Math.link.down.push(nodo);
        nodo.link.up.push(Math);
      }
    });
    // create params
    Math.params = getTagParams(params);
    // push to data.ids
    if (Math.params.id) data.map.id[Math.params.id] = Math;
  };

  while ((result = Pattern.exec(Text)) !== null) {
    _loop();
  }
  if (inner.length) return inner;else return Text;
}

function getTagParams(Text) {
  var Pattern = new RegExp(paramParse, "gim");
  var params = {};
  var result = null;
  while ((result = Pattern.exec(Text)) !== null) {
    var key = result[1];
    var value = result[3];
    if (key) params[key.toLowerCase()] = value ? value.toLowerCase() : undefined;
  }
  return params;
}

function main(html) {
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
}

function getResume() {
  /*   */
}

var doEach = function doEach(obj, func) {
  return Object.keys(obj).forEach(function (n) {
    return func(obj[n], n);
  });
};
var Copy = function Copy(Obj) {
  var base = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  return Object.assign(base, Obj);
};

var tagParse = "(<\\??([^ =>]+)([^>]*?))(?:\\/>|>([\\w\\W]+?)(?:<\\/\\2>)|>)";
var paramParse = "(?:([^ ?=]+))(?:=([\"])((?:\\\\\\2|.)+?)(?:\\2))?";

var data = { ready: false };
var debug = false;

module.exports = {
  parse: main,
  resume: getResume
};