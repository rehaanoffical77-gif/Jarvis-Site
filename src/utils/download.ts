export const JARVIS_APK_URL = 'https://raw.githubusercontent.com/rehaanoffical77-gif/Jarvis-Ai/main/Jarvis-AI-Release.apk';

export const triggerApkDownload = () => {
  if (typeof window === 'undefined') return;
  const link = document.createElement('a');
  link.href = JARVIS_APK_URL;
  link.setAttribute('download', 'Jarvis-AI-Release.apk');
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
