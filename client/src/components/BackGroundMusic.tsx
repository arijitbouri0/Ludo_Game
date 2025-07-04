import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import bgMusic from "../assets/background-music.mp3";
import type { RootState } from "../redux/store";

const BackgroundMusic = () => {
  const isMusicPlaying = useSelector((state: RootState) => state.audio.isMusicPlaying);
  const isMuted = useSelector((state: RootState) => state.audio.isMuted);
  const audioRef = useRef<HTMLAudioElement>(new Audio(bgMusic));

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    const handleInteraction = () => {
      if (!isMuted && isMusicPlaying) {
        audio.play().catch(err => console.log("Autoplay error:", err));
      }
      document.removeEventListener("click", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);

    if (!isMusicPlaying || isMuted) {
      audio.pause();
    }

    return () => audio.pause(); // stop when component unmounts
  }, [isMusicPlaying, isMuted]);

  return null;
};

export default BackgroundMusic;
