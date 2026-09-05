export const JARVIS_APK_URL = 'https://raw.githubusercontent.com/rehaanoffical77-gif/Jarvis-Ai/main/Jarvis-AI-Release.apk';
export const VERSION_JSON_URL = 'https://raw.githubusercontent.com/rehaanoffical77-gif/Jarvis-Ai/main/version.json';

export interface AppVersionInfo {
  versionName: string;
  versionCode?: number;
  apkName?: string;
  downloadUrl: string;
  apkUrl?: string;
  changelog?: string;
}

export const DEFAULT_APP_VERSION: AppVersionInfo = {
  versionName: '1.5.0',
  versionCode: 106,
  apkName: 'Jarvis-AI-Release.apk',
  downloadUrl: JARVIS_APK_URL,
  apkUrl: JARVIS_APK_URL,
  changelog: 'Cloud Firestore User Profile Sync, Cyberpunk Glassmorphic UI updates, and continuous Android automation.',
};

export const fetchLatestAppVersion = async (): Promise<AppVersionInfo> => {
  try {
    const response = await fetch(`${VERSION_JSON_URL}?t=${Date.now()}`, {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch version info`);
    }

    const data = await response.json();
    return {
      versionName: data.versionName || DEFAULT_APP_VERSION.versionName,
      versionCode: typeof data.versionCode === 'number' ? data.versionCode : DEFAULT_APP_VERSION.versionCode,
      apkName: data.apkName || DEFAULT_APP_VERSION.apkName,
      downloadUrl: data.downloadUrl || data.apkUrl || JARVIS_APK_URL,
      apkUrl: data.apkUrl || data.downloadUrl || JARVIS_APK_URL,
      changelog: data.changelog || DEFAULT_APP_VERSION.changelog,
    };
  } catch (error) {
    console.warn('Could not fetch latest version from GitHub, falling back to default:', error);
    return DEFAULT_APP_VERSION;
  }
};

export const triggerApkDownload = (customUrl?: string) => {
  if (typeof window === 'undefined') return;
  const targetUrl = customUrl || JARVIS_APK_URL;
  const urlWithCacheBuster = targetUrl.includes('?')
    ? `${targetUrl}&v=${Date.now()}`
    : `${targetUrl}?v=${Date.now()}`;

  const link = document.createElement('a');
  link.href = urlWithCacheBuster;
  link.setAttribute('download', 'Jarvis-AI-Release.apk');
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

