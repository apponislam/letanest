import { baseApi } from "../../api/baseApi";
import { TUser } from "./authSlice";

type RefreshTokenResponse = {
    data: {
        refreshToken: string;
        accessToken: string;
        user: TUser;
    };
};

const authApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (userInfo) => ({
                url: "/auth/login",
                method: "POST",
                body: userInfo,
            }),
        }),
        register: builder.mutation({
            query: (userInfo) => ({
                url: "/auth/register",
                method: "POST",
                body: userInfo,
            }),
        }),
        refreshToken: builder.mutation<RefreshTokenResponse, void>({
            query: () => ({
                url: "/auth/refresh-token",
                method: "POST",
                credentials: "include",
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
                credentials: "include",
            }),
        }),
        // === Forgot password endpoints ===
        requestPasswordResetOtp: builder.mutation<void, { email: string }>({
            query: (body) => ({
                url: "/auth/forgot-password",
                method: "POST",
                body,
            }),
        }),
        verifyOtp: builder.mutation<void, { email: string; otp: string }>({
            query: (body) => ({
                url: "/auth/verify-otp",
                method: "POST",
                body,
            }),
        }),
        resendResetOtp: builder.mutation<void, { email: string }>({
            query: (body) => ({
                url: "/auth/resend-reset-otp",
                method: "POST",
                body,
            }),
        }),
        resetPasswordWithOtp: builder.mutation<void, { email: string; otp: string; newPassword: string }>({
            query: (body) => ({
                url: "/auth/reset-password",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useRefreshTokenMutation, useLogoutMutation, useRequestPasswordResetOtpMutation, useVerifyOtpMutation, useResendResetOtpMutation, useResetPasswordWithOtpMutation } = authApi;
