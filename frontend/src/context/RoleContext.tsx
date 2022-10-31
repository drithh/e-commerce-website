import React, { createContext, useContext, useState } from 'react';

import { OpenAPI, AuthenticationService } from '../api';
import { toast } from 'react-toastify';
import { useQuery } from 'react-query';
import Cookies from 'js-cookie';

const RoleContext = createContext({});

export const useRole = () => {
  return useContext(RoleContext);
};

interface RoleProviderProps {
  children: React.ReactNode;
}

export const RoleProvider = ({ children }: RoleProviderProps) => {
  const [role, setRole] = useState('public');

  const { refetch } = useQuery(
    'authentication',
    () =>
      AuthenticationService.getRole({
        access_token: Cookies.get('token') || '',
      }),
    {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: Infinity,
      onSuccess: (data) => {
        toast.success(data.message);
        setRole(data.message);
        if (data.message === 'user' || data.message === 'admin') {
          OpenAPI.TOKEN = Cookies.get('token') || '';
        }
      },
    }
  );

  const value = {
    role,
    setRole,
    refetch,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};
