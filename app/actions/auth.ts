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

  // Extract flat permissions
  const permissionsSet = new Set<string>();
  if (userData.permissions) {
    userData.permissions.forEach((p: any) => permissionsSet.add(p.codename));
  }
  if (userData.groups) {
    userData.groups.forEach((group: any) => {
      group.permissions?.forEach((p: any) => permissionsSet.add(p.codename));
    });
  }
  const flatPermissions = Array.from(permissionsSet);

  // Set basic user info as a stringified object (safely)
  cookieStore.set({
    name: "user_data",
    value: JSON.stringify({
      username: userData.username,
      user_id: userData.user_id,
      is_superuser: userData.is_superuser,
      is_staff: userData.is_staff,
      permissions: flatPermissions,
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
