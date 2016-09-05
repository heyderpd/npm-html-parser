
/*!
 * html-parse-regex
 * Copyright (c) 2016 heyderpd <heyderpd@gmail.com>
 * ISC Licensed
 */

function parseData(Text, startPoint = 0, R = 0) {
  if (!Text)
    return ''
  if (typeof(Text) !== 'string')
    throw "Try Parse Object as a String"
  if (R++ > 42)
    throw "Limit recursive exceeded in f.parseData"

  const Pattern = new RegExp(tagParse, "gim")
  let inner = []
  let result = null
  while ((result = Pattern.exec(Text)) !== null) {
    const tag = result[2] === undefined ? null : result[2]
    const params = result[3] === undefined ? null : result[3]
    const innerHtml = result[4]
    // push to data.Objs
    let Math = {
       tag: tag,
      link: { up: [], down: [], out: [], in: [] },
    string: {
        start: startPoint +result.index,
          end: startPoint +Pattern.lastIndex
        }
    }
    const refPoint = Math.string.start +1 +(typeof(result[1]) === 'string' ? result[1].length : 0)
    // push to data.List
    data.List.push(Math)
    inner.push(Math)
    // create inner node's
    Math.inner = parseData(innerHtml, refPoint, R)
    if (typeof(Math.inner) === 'object')
      doEach(Math.inner, nodo => {
        if (nodo) {
          Math.link.down.push(nodo)
          nodo.link.up.push(Math)
        }
      })
    // create params
    Math.params = getTagParams(params)
    // push to data.ids
    if (Math.params.id)
      data.map.id[Math.params.id] = Math
  }
  if (inner.length)
    return inner
  else
    return Text
}

function getTagParams(Text) {
  const Pattern = new RegExp(paramParse, "gim")
  let params = {}
  let result = null
  while ((result = Pattern.exec(Text)) !== null) {
    const key = result[1]
    const value = result[3]
    if (key) params[key.toLowerCase()] = value ? value.toLowerCase() : undefined
  }
  return params
}

function main(html) {
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

const doEach = (obj, func) => Object.keys(obj).forEach(n => func(obj[n], n))
const Copy = (Obj, base = {}) => Object.assign(base, Obj)

const tagParse = "(<\\??([^ =>]+)([^>]*?))(?:\\/>|>([\\w\\W]+?)(?:<\\/\\2>)|>)"
const paramParse = "(?:([^ ?=]+))(?:=([\"])((?:\\\\\\2|.)+?)(?:\\2))?"

let data = { ready: false }
let debug = false

module.exports = {
  parse:  main,
  resume: getResume
}
