export default async function handler(req: any, res: any) {
  try {
    const apkUrl = 'https://github.com/jarvisrehaans/Jarvis/raw/main/Jarvis-AI-Release.apk';
    
    // Fetch the APK stream securely from the repository
    const response = await fetch(apkUrl);
    if (!response.ok) {
      // If fetching fails, redirect securely
      return res.redirect(302, apkUrl);
    }

    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', 'attachment; filename="Jarvis-AI.apk"');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');

    const arrayBuffer = await response.arrayBuffer();
    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (err) {
    // Fallback: 302 redirect
    return res.redirect(302, 'https://github.com/jarvisrehaans/Jarvis/raw/main/Jarvis-AI-Release.apk');
  }
}
