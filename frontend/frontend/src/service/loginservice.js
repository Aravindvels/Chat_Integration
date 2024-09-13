import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "./baseQuery";
import { ENDPOINTS_CONSTANTS } from "../constant/endpoint";

export const baseService = createApi({
  reducerPath: "baseService",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["USER"],
  endpoints: (builder) => ({
    userMe: builder.query({
      query: () => `${ENDPOINTS_CONSTANTS.ME}/user`,
      providesTags: ["USER"],
    }),
    userLogin: builder.mutation({
      query: (body) => ({
        url: `${ENDPOINTS_CONSTANTS.ME}/login`,
        method: "POST",
        body,
      }),
    }),
    updateUserDetails: builder.mutation({
      query: (updatedUserData) => ({
        url: ENDPOINTS_CONSTANTS.ME,
        method: "PATCH",
        body: updatedUserData,
      }),
      invalidatesTags: ["USER"],
    }),
    postUserDetails: builder.mutation({
      query: (updatedUserData) => ({
        url: `${ENDPOINTS_CONSTANTS.ME}/register`,
        method: "POST",
        body: updatedUserData,
      }),
      invalidatesTags: ["USER"],
    }),
    updatePassword: builder.mutation({
      query: (passwords) => ({
        url: `${ENDPOINTS_CONSTANTS.ME}/forgot-password`,
        method: "POST",
        body: passwords,
      }),
      invalidatesTags: ["USER"],
    }),
    requestPassword:builder.mutation({
      query: (passwords) => ({
        url: `${ENDPOINTS_CONSTANTS.ME}/forgot-password-request`,
        method: "POST",
        body: passwords,
      }),
      invalidatesTags: ["USER"],
    }),
    exportPdf: builder.query({
      query: () => `${ENDPOINTS_CONSTANTS.EXPORT}/pdf`,
      providesTags: ["USER"],
    }),
  }),
});

export const {
  useUpdateUserDetailsMutation,
  useUpdatePasswordMutation,
  usePostUserDetailsMutation,
  useUserLoginMutation,
  useLazyUserMeQuery,
  useLazyExportPdfQuery,
  useRequestPasswordMutation
} = baseService;
