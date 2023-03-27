class Model {
  constructor() {
    this._state = {};
    this._changeHandlers = [];
  }

  set(key, value, { silent = false } = {}) {
    var old = this._state[key];
    if (old !== value) {
      this._state[key] = value;
      if (!silent) {
        this._triggerChange();
      }
    }
  }

  unset(key) {
    this.set(key, undefined);
  }

  get(key) {
    return this._state[key];
  }

  cur() {
    return this._state;
  }

  has(key) {
    return this.get(key) != null;
  }

  when(key) {
    return new Promise((resolve) => {
      if (this.has(key)) {
        setTimeout(() => resolve(this.get(key)), 1);
      } else {
        var cb = () => {
          if (this.has(key)) {
            this.off(cb);
            resolve(this.get(key));
            return false;
          }
        };
        this.on("change", cb);
      }
    });
  }

  apply(attrs, { silent = false } = {}) {
    for (var k in attrs) {
      if (attrs.hasOwnProperty(k)) {
        this.set(k, attrs[k], { silent: true });
      }
    }
    if (!silent) {
      this._triggerChange();
    }
  }

  on(evt, cb) {
    switch (evt) {
      case "change":
        this._changeHandlers.push(cb);
        break;
      default:
        console.error("Unknown event " + evt);
    }
  }

  off(evt, cb) {
    if (evt == "change") {
      if (cb == null) {
        this._changeHandlers = [];
      } else {
        this._changeHandlers = this._changeHandlers.filter(
          (handler) => handler !== cb
        );
      }
    }
  }

  _triggerChange() {
    this._changeHandlers.forEach((h) => h(this._state));
  }
}

export default Model;
