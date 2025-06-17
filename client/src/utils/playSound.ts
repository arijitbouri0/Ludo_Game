// utils/playSound.ts
import type { RootState } from "../redux/store";

export const playSound = (audio: HTMLAudioElement, getState: () => RootState) => {
    const isMuted = getState().audio.isMuted;
    if (!isMuted) {
        audio.currentTime = 0;
        audio.play();
    }
};
