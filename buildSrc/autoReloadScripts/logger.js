class Logger {
  constructor(tag) {
    this.tag = tag;
  }

  info(message, ...args) {
    console.info(`[${this.tag}] ${message}`, ...args);
  }

  error(message, ...args) {
    console.error(`[${this.tag}] ${message}`, ...args);
  }
}

module.exports = Logger;
