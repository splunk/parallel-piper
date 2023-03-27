class DeviceMotion {
  measure(callback, { interval = 1000 } = {}) {
    return setInterval(() => {
      callback(Math.round(Math.random() * 80), true);
    }, interval);
  }

  supported() {
    return true;
  }
}

export default new DeviceMotion();
