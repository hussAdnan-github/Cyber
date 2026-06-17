"use server";

import { cookies } from "next/headers";

export async function setAuthCookies(token: string, userData: any) {
  const cookieStore = await cookies();
  
  // Set the token
  cookieStore.set({
    name: "token",
    value: token,
    httpOnly: false, // We need to access it from the client (Axios interceptor)
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  // Set basic user info as a stringified object (safely)
  cookieStore.set({
    name: "user_data",
    value: JSON.stringify({
      username: userData.username,
      user_id: userData.user_id,
      is_superuser: userData.is_superuser,
      is_staff: userData.is_staff,
    }),
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("user_data");
}
