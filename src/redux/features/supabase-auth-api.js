import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "@/lib/supabase";
import { userLoggedIn, userLoggedOut } from "./auth/authSlice";

export const supabaseAuthApi = createApi({
  reducerPath: "supabaseAuthApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    // 회원가입
    signUp: builder.mutation({
      async queryFn({ email, password, userData = {} }) {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: userData, // 추가 사용자 정보
            },
          });

          if (error) throw error;

          return { data };
        } catch (error) {
          return { error: error.message };
        }
      },
    }),

    // 로그인
    signIn: builder.mutation({
      async queryFn({ email, password }) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          return { data };
        } catch (error) {
          return { error: error.message };
        }
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result.data?.user) {
            dispatch(
              userLoggedIn({
                user: result.data.user,
                session: result.data.session,
              })
            );
          }
        } catch (err) {
          console.error("Login error:", err);
        }
      },
    }),

    // Google OAuth 로그인
    signInWithGoogle: builder.mutation({
      async queryFn() {
        try {
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (error) throw error;
          return { data };
        } catch (error) {
          return { error: error.message };
        }
      },
    }),

    // 로그아웃
    signOut: builder.mutation({
      async queryFn() {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          return { data: { success: true } };
        } catch (error) {
          return { error: error.message };
        }
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(userLoggedOut());
        } catch (err) {
          console.error("Logout error:", err);
        }
      },
    }),

    // 비밀번호 재설정
    resetPassword: builder.mutation({
      async queryFn({ email }) {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          });

          if (error) throw error;
          return { data: { success: true } };
        } catch (error) {
          return { error: error.message };
        }
      },
    }),

    // 비밀번호 업데이트
    updatePassword: builder.mutation({
      async queryFn({ password }) {
        try {
          const { data, error } = await supabase.auth.updateUser({
            password,
          });

          if (error) throw error;
          return { data };
        } catch (error) {
          return { error: error.message };
        }
      },
    }),

    // 프로필 업데이트
    updateProfile: builder.mutation({
      async queryFn({ userData }) {
        try {
          const { data, error } = await supabase.auth.updateUser({
            data: userData,
          });

          if (error) throw error;
          return { data };
        } catch (error) {
          return { error: error.message };
        }
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result.data?.user) {
            dispatch(
              userLoggedIn({
                user: result.data.user,
              })
            );
          }
        } catch (err) {
          console.error("Profile update error:", err);
        }
      },
    }),

    // 현재 사용자 세션 확인
    getCurrentUser: builder.query({
      async queryFn() {
        try {
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser();
          if (error) throw error;
          return { data: user };
        } catch (error) {
          return { error: error.message };
        }
      },
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useSignInWithGoogleMutation,
  useSignOutMutation,
  useResetPasswordMutation,
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
  useGetCurrentUserQuery,
} = supabaseAuthApi;
