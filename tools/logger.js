let canLog = true

export function setCanLog(state) {
  canLog = !!state
}
export function logger() {
  canLog && console.log(...arguments)
}
