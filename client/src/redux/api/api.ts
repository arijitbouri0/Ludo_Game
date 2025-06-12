import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "../../constants/api";

interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    _id: string;
    username: string;
    email: string;
  };
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

const gameApi = createApi({
  reducerPath: "gameApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${url}/api/`,
    credentials: "include", // Important if you're using cookies
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "user/login",
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: "user/register",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "user/logout",
        method: "POST",
        credentials: "include", 
      }),
    }),
    myProfile: builder.query<AuthResponse, void>({
      query: () => ({
        url: "user/me",
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useMyProfileQuery,
} = gameApi;

export default gameApi;
