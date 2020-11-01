export async function asyncMap(arr, cb) {
  const rtn = []
  for (let i = 0, j = arr.length; i < j; i++) {
    try {
      rtn.push(await cb(arr[i], i, arr))
    } catch (error) {
      throw error
    }
  }
  return rtn
}
