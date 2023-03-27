/**
 *  Request permission on Safari iOS >=14.5
 */
export async function checkPermission() {
  if (needsPermissionCheck()) {
    return window.DeviceMotionEvent.requestPermission();
  } else {
    throw new Error("Permission check not required");
  }
}

/**
 * Check whether the device needs to request permissions (Safari iOS >=14.5)
 */
export function needsPermissionCheck() {
  return (
    supportsDeviceMotion() &&
    typeof window.DeviceMotionEvent.requestPermission === "function"
  );
}

/**
 *  Check whether the device supports device motion events
 */
export function supportsDeviceMotion() {
  return "DeviceMotionEvent" in window;
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
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function deviceSupportSummary() {
  return {
    deviceMotion: supportsDeviceMotion(),
    privateBrowsing: isPrivateBrowsing(),
    likelyMobileDevice: likelyMobileDevice(),
  };
}
