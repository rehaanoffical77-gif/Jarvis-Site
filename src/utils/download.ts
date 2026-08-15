export const JARVIS_APK_URL = 'https://raw.githubusercontent.com/rehaanoffical77-gif/Jarvis-Ai/main/Jarvis-AI-Release.apk';

export const triggerApkDownload = () => {
  if (typeof window === 'undefined') return;
  window.location.href = `${JARVIS_APK_URL}?v=${Date.now()}`;
};
