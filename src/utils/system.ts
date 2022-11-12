export class System {
  /**
   * Get memory info
   *
   * @returns {NodeJS.MemoryUsage}
   */
  static memory (): Partial<NodeJS.MemoryUsage> {
    const memory = process.memoryUsage()
    const keys = Object.keys(memory)

    const a = memory

    keys.forEach((key) => {
      // @ts-ignore
      memory[key] = (a[key] / 1024 / 1024).toFixed(2) + 'MB'
    })

    return memory
  }

  static processReadyAt () {
    return new Date(Date.now() - process.uptime() * 1000)
  }
}
