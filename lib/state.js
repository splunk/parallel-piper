import Model from "model";
import guid from "guid";
import { deviceSupported, isPrivateBrowsing } from "featurecheck";

const STORAGE_KEY = "pp_state";

class State extends Model {
  constructor() {
    super();
    this.on("change", (state) => State._persist(state));
  }

  bootstrap() {
    var cur = State._load();
    if (cur != null) {
      this.apply(cur);
      this.set("seenBefore", true);
    } else {
      this.set("seenBefore", false);
    }
    if (!this.has("uid")) {
      this.set("uid", guid());
    }
    this.unset("setupComplete");
    this.set("motionDetected", false);
    this.set("deviceNotSupported", !deviceSupported());
    this.set("isPrivateBrowsing", isPrivateBrowsing());
    if (this.has("selectedState") && this.get("nameSubmitted")) {
      this.completeSetup();
    }
    this.set("setupMode", true);
  }

  applySelectedState(name) {
    if (name) {
      this.apply({
        stateSelected: true,
        selectedState: name,
      });
    }
  }

  applyName(name) {
    if (name) {
      this.set("name", name);
    }
    this.set("nameSubmitted", true);
    this.completeSetup();
  }

  completeSetup(force) {
    if (this.get("nameSubmitted") && this.get("stateSelected")) {
      if (force) {
        this.set("setupMode", false);
        this.set("setupComplete", true);
      } else {
        this._setupTimer = setTimeout(() => this.completeSetup(true), 3000);
      }
    }
  }

  recordAcceleration(val, receivedMotion) {
    if (receivedMotion) {
      this.set("motionDetected", true);
    }
    let total = this.get("totalAcceleration") || 0;
    total += val;
    this.set("totalAcceleration", total);
    this.set("acceleration", val);
    if (val >= 5) {
      this.completeSetup(true);
    }
  }

  reset() {
    localStorage.clear();
    this._state = {};
    this.bootstrap();
  }

  static _persist(state) {
    var data = Object.assign({}, state);
    try {
      localStorage[STORAGE_KEY] = JSON.stringify(data);
    } catch (e) {
      // Ignore if it fails -- private browsing on iOS
    }
  }

  static _load() {
    return STORAGE_KEY in localStorage
      ? JSON.parse(localStorage[STORAGE_KEY])
      : null;
  }
}

export default new State();
