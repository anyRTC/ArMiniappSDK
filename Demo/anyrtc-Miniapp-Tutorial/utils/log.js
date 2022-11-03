var log = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null

module.exports = {
  debug() {
    if (!log) return
    log.debug(...arguments)
    console.debug(...arguments)
  },
  info() {
    if (!log) return
    log.info(...arguments)
    console.info(...arguments)
  },
  warn() {
    if (!log) return
    log.warn(...arguments)
    console.warn(...arguments)
  },
  error() {
    if (!log) return
    log.error(...arguments)
    console.error(...arguments)
  },
  setFilterMsg(msg) { // 从基础库2.7.3开始支持
    if (!log || !log.setFilterMsg) return
    if (typeof msg !== 'string') return
    log.setFilterMsg(msg)
  },
  addFilterMsg(msg) { // 从基础库2.8.1开始支持
    if (!log || !log.addFilterMsg) return
    if (typeof msg !== 'string') return
    log.addFilterMsg(msg)
  }
}