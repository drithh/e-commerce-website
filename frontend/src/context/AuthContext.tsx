import React, { createContext, useContext, useState } from 'react';

import {
  OpenAPI,
  AuthenticationService,
  UserRead,
  DefaultResponse,
} from '../api';
import { UseMutationResult, useQuery } from 'react-query';
import Cookies from 'js-cookie';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

export type authType = {
  role: string;
  setRole?: React.Dispatch<React.SetStateAction<string>>;
  login?: UseMutationResult<
    UserRead,
    unknown,
    {
      email: string;
      password: string;
    },
    unknown
  >;
  register?: UseMutationResult<
    UserRead,
    unknown,
    {
      name: string;
      email: string;
      password: string;
      phone: string;
    },
    unknown
  >;
  forgotPassword?: UseMutationResult<DefaultResponse, unknown, string, unknown>;
  resetPassword?: UseMutationResult<
    DefaultResponse,
    unknown,
    {
      email: string;
      token: string;
      password: string;
    },
    unknown
  >;
  logout?: () => void;
};

const AuthContext = createContext<authType>({ role: 'none' });

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

const useProvideAuth = () => {
  const [role, setRole] = useState('none');

  const { refetch } = useQuery(
    'authentication',
    () => AuthenticationService.getRole(),
    {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: Infinity,
      onSuccess: (data) => {
        setRole(data.message);
        OpenAPI.TOKEN = Cookies.get('token');
      },
    }
  );

  const login = useMutation(
    (variables: { email: string; password: string }) =>
      AuthenticationService.signIn({
        username: variables.email,
        password: variables.password,
      }),
    {
      onSuccess: (data) => {
        toast.success(`Welcome back ${data.name}!`);
        Cookies.set('token', data.access_token);
        OpenAPI.TOKEN = data.access_token;
        refetch();
      },
    }
  );

  const register = useMutation(
    (variables: {
      name: string;
      email: string;
      password: string;
      phone: string;
    }) =>
      AuthenticationService.signUp({
        name: variables.name,
        email: variables.email,
        password: variables.password,
        phone_number: variables.phone,
      }),
    {
      onSuccess: (data) => {
        Cookies.set('token', data.access_token);
        toast.success(`Welcome ${data.name}!`);
        OpenAPI.TOKEN = data.access_token;
        refetch();
      },
    }
  );

  const forgotPassword = useMutation((email: string) =>
    AuthenticationService.forgotPassword(email)
  );

  const resetPassword = useMutation(
    (variables: { email: string; token: string; password: string }) =>
      AuthenticationService.resetPassword({
        email: variables.email,
        token: variables.token,
        password: variables.password,
      })
  );

  const logout = () => {
    Cookies.remove('token');
    OpenAPI.TOKEN = '';
    window.location.reload();
  };

  return {
    role,
    setRole,
    login,
    refetch,
    register,
    forgotPassword,
    resetPassword,
    logout,
  };
};
