/**
 *  Check whether the device supports device motion events
 */
export function supportsDeviceMotion() {
    return 'ondevicemotion' in window;
}

/**
 * Check if Safari is in private-browsing mode, since it won't trigger any motion events in this case
 */
export function isPrivateBrowsing() {
    try {
        localStorage.______t = 1;
        localStorage.______t = undefined;
        return false;
    } catch (e) {
        return true;
    }
}

export function deviceSupported() {
    return supportsDeviceMotion() && !isPrivateBrowsing();
}

export function likelyMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function deviceSupportSummary() {
    return {
        deviceMotion: supportsDeviceMotion(),
        privateBrowsing: isPrivateBrowsing(),
        likelyMobileDevice: likelyMobileDevice()
    };
}