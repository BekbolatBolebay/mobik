// OneSignal SDK-ны инициализациялау
// NEXT_PUBLIC_ONESIGNAL_APP_ID осы жерде қолданылады
export function initOneSignal() {
  if (typeof window !== "undefined" && !window.OneSignal) {
    window.OneSignal = window.OneSignal || []
    window.OneSignal.push(() => {
window.OneSignal.init({
  appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!, // міндетті түрінде "!" қос
  safari_web_id: process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_ID, // .env ішіне қоссын
  notifyButton: { enable: true },
  allowLocalhostAsSecureOrigin: true,
})

    })
  }
}

// OneSignal REST API Key серверде қолданылады, мысалы, хабарлама жіберу үшін
// import fetch from 'node-fetch'; // Node.js ортасы үшін
// export async function sendOneSignalNotification(heading: string, contents: string, playerIds: string[]) {
//   const response = await fetch("https://onesignal.com/api/v1/notifications", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json; charset=utf-8",
//       "Authorization": `Basic ${process.env.ONESIGNAL_REST_API_KEY}`
//     },
//     body: JSON.stringify({
//       app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
//       contents: { en: contents },
//       headings: { en: heading },
//       include_player_ids: playerIds,
//     }),
//   });
//   return response.json();
// }
