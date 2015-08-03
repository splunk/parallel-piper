import {supportsDeviceMotion} from 'featurecheck';

class DeviceMotion {
    constructor() {
        this.callbacks = [];
    }

    measure(callback, {interval=1000}={}) {
        let cur = 0, receivedEvent = false;
        window.addEventListener('devicemotion', e => {
            console.log('MOTION', e.acceleration);
            let {x,y,z} = e.acceleration;
            cur = Math.max(Math.sqrt(x * x + y * y + z * z), cur);
            receivedEvent = x != null || y != null || z != null;
        }, true);

        return setInterval(() => {
            callback(Math.round(cur), receivedEvent);
            cur = 0;
        }, interval);
    }

    stop(timer) {
        clearInterval(timer);
    }


    supported() {
        return supportsDeviceMotion();
    }
}

export default new DeviceMotion();
