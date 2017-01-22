function parseQuery(str) {
  const query = {}
  if (str.length) {
    str.replace(/\+/g, ' ').split('&').forEach(s => {
      const pair = s.split('=')
      const key = decodeURIComponent(pair[0])
      const val = pair.length === 1 ? '' : decodeURIComponent(pair[1])
      if (query[key] == null) {
        query[key] = val
      } else {
        if (query[key].constructor !== Array) query[key] = [query[key]]
        query[key].push(val)
      }
    })
  }
  return query
}

function formatQuery(obj) {
  let str = ''
  for (const p in obj) {
    const key = encodeURIComponent(p);
    [].concat(obj[p]).forEach(val => {
      if (val == null) return
      str += '&' + key
      if (val !== '') str += '=' + encodeURIComponent(val)
    })
  }
  return str.slice(1)
}

function parse(str) {
  const m = /^(?:([^:/?#]+:))?(?:\/\/(?:(([^:@]*)(?::([^:@]*))?)?@)?(([^:/?#]*)(?::(\d*))?))?(((?:[^?#/]*\/)*[^?#]*)(?:(\?[^#]*))?)(?:(#.*))?/.exec(str)
  const url = {}
  ;['href', 'protocol', 'auth', 'username', 'password', 'host', 'hostname', 'port', 'path', 'pathname', 'search', 'hash'].forEach((key, i) => url[key] = m[i] || '')
  if (!url.path && !url.pathname) url.path = url.pathname = '/'
  url.query = parseQuery(url.search.slice(1))
  return url
}

function format({ protocol = '', auth = '', username = '', password = '', host = '', hostname = '', port = '', path = '', pathname = '', search = '', query = null, hash = '' } = {}) {
  let str = ''

  if (protocol) {
    str += protocol
    if (protocol.slice(-1) !== ':') str += ':'
  }

  if (protocol || host || hostname) str += '//'

  if (host || hostname) {
    if (auth) {
      str += auth + '@'
    } else if (username) {
      str += username
      if (password) str += ':' + password
      str += '@'
    }

    if (host) {
      str += host
    } else {
      str += hostname
      if (port) str += ':' + port
    }
  }

  if (path) {
    str += path
  } else {
    str += pathname || '/'

    if (search) {
      str += search
    } else if (query) {
      const q = formatQuery(query)
      if (q) str += '?' + q
    }
  }

  str += hash

  return str
}

function resolve(from, to) {
  from = parse(from)
  to = parse(to)

  // 'to' is an absolute URL
  if (to.protocol) return to.href

  // 'to' only need to complete the protocol
  if (to.host) {
    to.protocol = from.protocol
    return format(to)
  }

  // 'to' has aboslute path
  if (to.path[0] === '/') {
    from.path = to.path
    from.pathname = from.search = ''
    from.query = null
    from.hash = to.hash
    return format(from)
  }

  if (to.pathname) {
    const dirFrom = from.pathname.split('/')
    // pop the filename
    dirFrom.pop()

    to.pathname.split('/').forEach(d => {
      switch (d) {
        case '.':
          return
        case '..':
          return dirFrom.length > 1 ? dirFrom.pop() : null
        default:
          dirFrom.push(d)
      }
    })

    from.pathname = dirFrom.join('/')
  }

  from.path = ''
  from.search = to.search
  from.query = null
  from.hash = to.hash
  return format(from)
}

export default { parse, format, resolve, parseQuery, formatQuery }
