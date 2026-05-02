export class BitField<T extends number> {
  constructor(public value: number = 0) {}

  add(flag: T): void {
    this.value |= flag;
  }

  has(flag: T): boolean {
    return (this.value & flag) === flag;
  }

  remove(flag: T): void {
    this.value &= ~flag;
  }

  toggle(flag: T): void {
    this.value ^= flag;
  }
}