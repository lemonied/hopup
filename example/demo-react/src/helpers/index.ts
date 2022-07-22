export class Token<T = void> {
  public resolve!: (value: T) => void;
  public promise: Promise<T>;
  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
    });
  }
}
