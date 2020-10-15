class Semaphore {
    constructor(max = 1) {
      this.max = max;
      this._fns = [];
      this._active = 0;
    }
  
    get remaining() {
      return this._fns.length;
    }
  
    get active() {
      return this._active;
    }
  
    take(fn) {
      this._fns.push(fn);
      this._try();
    }
  
    _done() {
      this._active -= 1;
      this._try();
    }
  
    _try() {
      if (this._active === this.max || this._fns.length === 0) return;
      let fn = this._fns.shift();
      this._active += 1;
      if (fn) fn(this._done.bind(this));
    }
  }