// Performance detection utility for low-end mobile/desktop devices

export const checkIsLowEndDevice = (): boolean => {
  if (typeof window === 'undefined') return false;

  // 1. Check screen width / mobile viewport
  const isSmallScreen = window.innerWidth < 768;

  // 2. Check CPU hardware concurrency (low core count <= 4)
  const isLowCpu = typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false;

  // 3. Check touch capability / mobile user agent
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  return isSmallScreen || isLowCpu || (isTouchDevice && isSmallScreen);
};

export const getOptimalDPR = (maxDpr = 1.25): number => {
  if (typeof window === 'undefined') return 1;
  const isLowEnd = checkIsLowEndDevice();
  if (isLowEnd) return 1.0;
  return Math.min(window.devicePixelRatio || 1, maxDpr);
};
