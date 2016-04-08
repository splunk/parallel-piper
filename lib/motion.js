import {supportsDeviceMotion} from 'featurecheck';
import Gyronorm from 'gyronorm/dist/gyronorm.complete';

class DeviceMotion {
    constructor() {
        this.listeners = []
    }

    startGryoNorm() {
        if (!this.gyronorm) {
            this.gyronorm = new Gyronorm();
            this.gyronorm.init({
                frequency: 50,
                gravityNormalized: true,
                decimalCount: 5,
                screenAdjusted: true
            }).then(()=>{
                this.gyronorm.start(e => this.listeners.forEach(l => l(e)));
            });
        }
    }

    stopGyroNorm() {
        if (this.gyronorm) {
            this.gyronorm.stop();
        }
    }

    listen(callback) {
        this.listeners.push(callback);
        this.startGryoNorm()
    }

    stopListening() {
        for (var listener of this.listeners) {
            window.removeEventListener('devicemotion', listener, true)
        }
    }

    measure(callback, {interval=1000}={}) {
        let cur = 0, receivedEvent = false;
        this.listen(e => {
            let {x,y,z} = e.dm;
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
