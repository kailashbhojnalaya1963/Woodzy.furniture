// Install a working in-memory localStorage for tests. Node 25 ships a global
// `localStorage` that needs --localstorage-file and otherwise throws, which
// shadows jsdom's. Force a functional one on both global and window.
class MemStorage implements Storage {
  private m = new Map<string, string>();
  get length() {
    return this.m.size;
  }
  clear() {
    this.m.clear();
  }
  getItem(k: string) {
    return this.m.has(k) ? this.m.get(k)! : null;
  }
  key(i: number) {
    return Array.from(this.m.keys())[i] ?? null;
  }
  removeItem(k: string) {
    this.m.delete(k);
  }
  setItem(k: string, v: string) {
    this.m.set(k, String(v));
  }
}

const mem = new MemStorage();
Object.defineProperty(globalThis, "localStorage", { value: mem, configurable: true });
if (typeof window !== "undefined") {
  Object.defineProperty(window, "localStorage", { value: mem, configurable: true });
}
