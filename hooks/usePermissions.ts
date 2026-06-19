"use client";

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export function usePermissions() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const userDataStr = Cookies.get('user_data');
  
      if (userDataStr) {
        const userData = JSON.parse(decodeURIComponent(userDataStr));
           
        setIsSuperuser(userData.is_superuser || false);
        setPermissions(userData.permissions || []);
      }
    } catch (e) {
      console.error('Failed to parse user_data cookie', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const hasPermission = (codename: string) => {
    if (isSuperuser) return true;
    return permissions.includes(codename);
  };

  const hasAnyPermission = (codenames: string[]) => {
    if (isSuperuser) return true;
    return codenames.some(codename => permissions.includes(codename));
  };

  return { permissions, isSuperuser, isLoading, hasPermission, hasAnyPermission };
}
