import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id:string;
  username: string;
  email: string;
}

interface InitialState {
  user: User | null;
  loader: boolean;
}

const initialState: InitialState = {
  user: null,
  loader: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
      userExist: (state, action: PayloadAction<User>) => {
      state.user = action.payload; 
      state.loader=false;
    },
    userNotExist: (state) => {
      state.user = null;
      state.loader = true;
    },
  },
});

export default authSlice;
export const { userExist, userNotExist } = authSlice.actions;
export type {User};
