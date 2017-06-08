import { tagCatcher } from './regex'
import { error, resetError, isLostCloseTag } from './error'
import { _tryPushNode, oneMapToFilter, _findOpen, _linkNodes, _pushList, createShortcutAndAttributes, createPureTextNode, createRoot } from './utils'

const getAllTags = html => {
  const Nodes = []
  const tryPushNode = _tryPushNode(tagCatcher, Nodes)
  let match
  while (match = tagCatcher.exec(html)) {
    tryPushNode(match)
  }
  return Nodes
}

const addAllPureTexts = (Nodes, html) => {
  let fullNodes = [], before = 0, text = ''
  Nodes
    .concat({ start: html.length })
    .map(node => {
      const end = node.start -before
      text = html.substr(before, end)
      text ? fullNodes.push(createPureTextNode(text, before, end)) : null
      before = node.end
      fullNodes.push(node)
    })
  fullNodes.pop()
  return fullNodes
}

const mountTree = (pushList, Nodes) => {
  let kOpen
  const { closes, noCloses } = oneMapToFilter(Nodes)
  const findOpen = _findOpen(noCloses)
  const linkNodes = _linkNodes(pushList, closes, noCloses)
  closes.map(
    (n, kClose) => {
      kOpen = findOpen(n.tag, kClose)
      if (kOpen !== false) {
        linkNodes(kOpen, kClose)
      } else {
        isLostCloseTag(closes[kClose])
      }
    }
  )
  return createRoot(pushList, noCloses)
}

const parse = html => {
  if (html === undefined) { throw 'param "html" is undefined' }
  if (typeof html !== 'string') { throw 'param "html" is undefined' }

  resetError()
  const list = []
  const pushList = _pushList(list)
  const tree = mountTree(
    pushList,
    addAllPureTexts(
      getAllTags(html),
      html))
  return {
    list: list,
    tree: tree,
    shortcut: createShortcutAndAttributes(list),
    error
  }
}

export default parse
