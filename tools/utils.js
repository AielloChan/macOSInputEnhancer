export const isArray = (arr) => arr instanceof Array
export const isFunction = (arr) => arr instanceof Function
export const isString = (arr) => typeof arr === 'string'
export const isOK = (a) => a !== null && a !== undefined
export const promisify = (fn) => (...params) =>
  new Promise((resolve, reject) => {
    try {
      fn(...params, function () {
        resolve(Array.from(arguments))
      })
    } catch (err) {
      reject(err)
    }
  })
