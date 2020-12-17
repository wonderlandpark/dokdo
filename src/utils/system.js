module.exports = class System {
  /**
   * Get memory info
   *
   * @returns {NodeJS.MemoryUsage}
   */
  static memory () {
    const memory = process.memoryUsage()
    const keys = Object.keys(memory)
    const a = memory
    const result = {}

    keys.forEach(key => {
      result[key] = (a[key] / 1024 / 1024).toFixed(2) + 'MB'
    })

    return result
  }

  static processReadyAt () {
    return new Date(new Date() - process.uptime() * 1000)
  }
}
