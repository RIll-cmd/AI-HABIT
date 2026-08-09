/**
 * Global Audio Utility for handling sound playback safely in Next.js (avoiding SSR issues).
 */

/**
 * Instantiates an Audio object and plays a UI sound from the /sounds/ directory.
 * @param filename The path to the sound file relative to the public directory (e.g., "/sounds/System UI & Navigation/SYSTEM--OPEN.mp3")
 * @param volume The playback volume (0.0 to 1.0)
 */
export function playUISound(filename: string, volume: number = 0.5) {
  if (typeof window === "undefined") return;

  try {
    const audio = new Audio(encodeURI(filename));
    audio.volume = volume;
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // Quietly swallow browser autoplay policy restriction warnings
        console.debug("[AudioUtil] Autoplay prevented for UI sound:", err);
      });
    }
  } catch (error) {
    console.debug("[AudioUtil] UI sound playback error:", error);
  }
}

/**
 * Instantiates an Audio object and plays a voice line from the /sounds/ directory.
 * @param filename The path to the voice line file (e.g., "/sounds/AIRA Persona/AI-NOTICE.mp3")
 * @param volume The playback volume (0.0 to 1.0)
 */
export function playVoiceLine(filename: string, volume: number = 0.8) {
  if (typeof window === "undefined") return;

  try {
    const audio = new Audio(encodeURI(filename));
    audio.volume = volume;
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // Quietly swallow browser autoplay policy restriction warnings
        console.debug("[AudioUtil] Autoplay prevented for voice line:", err);
      });
    }
  } catch (error) {
    console.debug("[AudioUtil] Voice line playback error:", error);
  }
}
