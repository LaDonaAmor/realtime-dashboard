export class RingBuffer<T> {
  private buf: T[] = [];
  constructor(private cap: number) {}
  push(x: T) {
    this.buf.push(x);
    if (this.buf.length > this.cap)
      this.buf.splice(0, this.buf.length - this.cap);
  }
  pushMany(xs: T[]) {
    this.buf.push(...xs);
    if (this.buf.length > this.cap)
      this.buf.splice(0, this.buf.length - this.cap);
  }
  toArray(): readonly T[] {
    return this.buf;
  }
  get length() {
    return this.buf.length;
  }
  clear() {
    this.buf = [];
  }
}
