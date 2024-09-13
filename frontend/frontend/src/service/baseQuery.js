import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { getLocalStorage, setLocalStorage } from "../utils/helper";
import { LOCAL_CONSTANTS } from "../constant/local";

const mutex = new Mutex();

export const resetAuth = () => {
  localStorage.removeItem(LOCAL_CONSTANTS.REFRESH);
  localStorage.removeItem(LOCAL_CONSTANTS.ACCESS);
};

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_BASE_URL,
  prepareHeaders: (headers) => {
    const token = getLocalStorage(LOCAL_CONSTANTS.ACCESS);
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        result = await refreshTokenAndRetry(args, api, extraOptions);
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export default baseQueryWithReauth;

const refreshTokenAndRetry = async (args, api, extraOptions) => {
  const refreshToken = getLocalStorage(LOCAL_CONSTANTS.REFRESH);

  if (!refreshToken) {
    console.error("No refresh token available");
    resetAuth();
    return { error: { status: 401, statusText: "No refresh token" } };
  }

  const refreshResult = await baseQuery(
    {
      url: "/auth",
      method: "POST",
      body: { refreshToken },
    },
    api,
    extraOptions
  );

  if (refreshResult.data) {
    const { token, refreshToken: newRefreshToken } = refreshResult.data;
    setLocalStorage(LOCAL_CONSTANTS.ACCESS, token);
    setLocalStorage(LOCAL_CONSTANTS.REFRESH, newRefreshToken);

    return await baseQuery(args, api, extraOptions);
  } else {
    console.error("Failed to refresh token");
    resetAuth();
    return { error: { status: 401, statusText: "Failed to refresh token" } };
  }
};
