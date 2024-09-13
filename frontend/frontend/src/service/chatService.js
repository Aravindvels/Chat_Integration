import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "./baseQuery";
import { ENDPOINTS_CONSTANTS } from "../constant/endpoint";

export const chatService = createApi({
  reducerPath: "chatService",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["CHATS"],
  endpoints: (builder) => ({
    allChats: builder.query({
      query: () => `${ENDPOINTS_CONSTANTS.CHATS}`,
      providesTags: ["CHATS"],
    }),
  }),
});

export const { useLazyAllChatsQuery } = chatService;
