
/*!
 * html-parse-regex
 * Copyright (c) 2016 heyderpd <heyderpd@gmail.com>
 * ISC Licensed
 */

const createMatch = (startPoint, result, Pattern) => ({
      tag: tag,
    link: { up: [], down: [], out: [], in: [] },
  string: {
      start: startPoint +result.index,
        end: startPoint +Pattern.lastIndex
      }
  })

const getGroups = (result) => ({
  tag:       result[2] !== undefined ? result[2] : null,
  params:    result[3] !== undefined ? result[3] : null,
  innerHtml: result[4]
})

const parseData = (data, startPoint = 0, R = 0) => {
  if (!data) {
    return ''
  }
  if (typeof(data) !== 'string') {
    throw "Try Parse Object as a String"
  }
  if (R++ > 42) {
    throw "Limit recursive exceeded in f.parseData"
  }

  const Pattern = new RegExp(tagParse, "gim")
  const inner = []
  let result = null

  while ((result = Pattern.exec(data)) !== null) {
    const { tag, params, innerHtml } = getGroups(result)
    // push to data.Objs
    const Match = createMatch(startPoint, result, Pattern)
    const refPoint = Match.string.start +1 +(typeof(result[1]) === 'string' ? result[1].length : 0)
    // push to data.List
    data.List.push(Match)
    inner.push(Match)
    // create inner node's
    Match.inner = parseData(innerHtml, refPoint, R)
    // link node's
    if (typeof(Match.inner) === 'object')
      map(nodo => {
        if (nodo) {
          Match.link.down.push(nodo)
          nodo.link.up.push(Match)
        }
      }, Match.inner)
    // create params
    Match.params = getTagParams(params)
    // push to data.ids
    if (Match.params.id) {
      data.map.id[Match.params.id] = Match
    }
  }
  if (inner.length)
    return inner
  else
    return data
}

const getTagParams = (text) => {
  const Pattern = new RegExp(paramParse, "gim")
  const params = {}
  let result = null
  while ((result = Pattern.exec(text)) !== null) {
    const key = result[1]
    const value = result[3]
    if (key) params[key.toLowerCase()] = value ? value.toLowerCase() : undefined
  }
  return params
}

const main = (html) => {
  // verify input
  if (html === undefined) { throw 'param "html" is undefined' }
  // initialize
  let start, crono
  if (debug) { start = +new Date() }
  data = {
    file: html,
     map: { id:{} },
    List: [],
    Objs: {},
   state: { resume:{}, ready: false }
  }
  data.Objs = parseData(html)
  data.ready = true
  if (debug) { crono = (+new Date() -start) /1000 }
  return data
}

function getResume() {
  /*   */
}

const { map } = require('pytils')

const tagParse = "(<\\??([^ =>]+)([^>]*?))(?:\\/>|>([\\w\\W]+?)(?:<\\/\\2>)|>)\n?"
const paramParse = "(?:([^ ?=]+))(?:=([\"])((?:\\\\\\2|.)+?)(?:\\2))?"

let data = { ready: false }
let debug = false

module.exports = {
  parse:  main,
  resume: getResume
}