export class CustomError extends Error {
  constructor(message) {
    super(message)
    this.data = message
    this.isCustom = true
  }
}
