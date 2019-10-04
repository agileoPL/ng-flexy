export class FlexyError extends Error {
  constructor(message: string, stack?: string) {
    super(message);
    this.message = message;
    if (stack) {
      this.stack = stack;
    }
  }
}
