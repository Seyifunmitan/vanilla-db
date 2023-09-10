/* eslint-disable no-useless-constructor */
/* eslint-disable constructor-super */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// set, get, remove, update, length, sync, request
export class CreateStore {
  // eslint-disable-next-line no-useless-constructor
  constructor() {}

  // work 0.0.4
  set(config) {
    // config to set data
    // db: 'database choice local or session', key: 'database key', data: 'data to store
    const { db, key, data } = config
    // data can be number, string and object
    const src = {
      time: Date(),
      data,
      key,
      type: typeof data
    }

    if (db === 'session') {
      CreateStore._sessionSet(key, JSON.stringify(src))
      return true
    } else if (db === 'local') {
      CreateStore._localSet(key, JSON.stringify(src))
      return true
    }
  }

  // works 0.0.4
  get(query) {
    // query to get data
    // db: 'database choice local or session', key: 'database key'
    const { db, key } = query

    if (db === 'local') {
      const res = localStorage.getItem(key)
      const { data } = JSON.parse(res)
      return data
    } else if (db === 'session') {
      const res = sessionStorage.getItem(key)
      const { data } = JSON.parse(res)
      return data
    }
  }

  static _sessionSet(key, data) {
    sessionStorage.setItem(key, data)
  }

  static _localSet(key, data) {
    localStorage.setItem(key, data)
  }

  // work 0.0.4
  remove(query) {
    // remove preconfig
    // db: 'database choice local or session', key: 'database key'
    const { db, key } = query
    if (db === 'local') {
      localStorage.removeItem(key)
    } else if (db === 'session') {
      sessionStorage.removeItem(key)
    }
  }

  // work 0.0.4
  sync(config) {
    // sync config
    // from: 'database to sync from, to: database to sync data to, key: 'database key', options: 'to delete the old data and set new key if neccessary'
    const { from, to, key, options } = config
    const { newKey, deleteOld } = options
    // sync store session data to local storage
    // ability to sync back and forth
    const query = { db: from, key }
    const data = this.get(query)

    const _config = {
      db: to,
      key: newKey === '' || newKey === null ? key : newKey,
      data,
      id: generate().SHORT
    }
    this.set(_config)
    if (deleteOld) {
      this.remove(query)
    }
    return true
  }

  // length of data work 0.0.4
  length(db) {
    if (db === 'local') {
      return localStorage.length
    } else if (db === 'session') {
      return sessionStorage.length
    }
  }

  request(config) {
    // make request to get a data most get request, storage the data in db like caching
    // preconfig
    // db: 'database choice local or session', key: 'database key', url: 'api link to fetch data mostly get', options: 'fetch options if neccessary'
    const { url, db, key, options } = config

    fetch(url, options)
      .then((res) => res.json())
      .then(async (data) => {
        const _config = {
          db,
          key,
          data
        }

        this.set(_config)
      })
  }

  // Struct hook to work with vanillaDb seamlessly like top level schema
}
