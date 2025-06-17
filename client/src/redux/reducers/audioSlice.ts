import { createSlice } from "@reduxjs/toolkit";

interface AudioState {
  isMuted: boolean;
  isMusicPlaying: boolean;
}

const initialState: AudioState = {
  isMuted: false,
  isMusicPlaying: true, // auto play by default
};

const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
    setMute: (state, action) => {
      state.isMuted = action.payload;
    },
     toggleMusic: (state) => {
      state.isMusicPlaying = !state.isMusicPlaying;
    },
    setMusicPlaying: (state, action) => {
      state.isMusicPlaying = action.payload;
    }
  },
});

export const { toggleMute, setMute ,setMusicPlaying,toggleMusic} = audioSlice.actions;
export default audioSlice;
