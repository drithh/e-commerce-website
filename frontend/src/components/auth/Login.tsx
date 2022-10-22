import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';

import Button from '../button/Button';
import Input from '../input/Input';

type Props = {
  onRegister: () => void;
  onForgotPassword: () => void;
  errorMsg: string;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  setSuccessMsg: React.Dispatch<React.SetStateAction<string>>;
};

const Login: React.FC<Props> = ({
  onRegister,
  onForgotPassword,
  errorMsg,
  setErrorMsg,
  setSuccessMsg,
}) => {
  // const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let loginResponse: any;
    if (loginResponse.success) {
      setSuccessMsg('login_successful');
    } else {
      setErrorMsg('incorrect_email_password');
    }
  };

  return (
    <>
      <Dialog.Title
        as="h3"
        className="text-4xl text-center my-8 font-medium leading-6 text-gray-800"
      >
        Login
      </Dialog.Title>
      <form onSubmit={handleSubmit} className="mt-2">
        <Input
          type="email"
          placeholder={'Email Address *'}
          name="email"
          required
          extraClass="w-full focus:border-gray-500"
          border="border-2 border-gray-300 mb-4"
          onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
          value={email}
        />
        <Input
          type="password"
          placeholder={'Password *'}
          name="password"
          required
          extraClass="w-full focus:border-gray-500 mb-4"
          border="border-2 border-gray-300"
          onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
          value={password}
        />
        {errorMsg !== '' && (
          <div className="text-red text-sm mb-4 whitespace-nowrap">
            {errorMsg}
          </div>
        )}
        <div className="flex justify-between mb-4">
          <div className="flex items-center text-gray-400 focus:outline-none">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              className="w-4 h-4 mb-0 mr-2"
            />
            <label htmlFor="remember" className="text-sm">
              Remember me?
            </label>
          </div>
          <span
            onClick={onForgotPassword}
            className="text-gray-400 text-sm hover:text-gray-500 focus:outline-none focus:text-gray-500 cursor-pointer"
          >
            Forgot your password?
          </span>
        </div>
        <Button
          type="submit"
          value={'Login'}
          extraClass="w-full text-center text-xl mb-4"
          size="lg"
        />
        <div className="text-center text-gray-400">
          Not a member?{' '}
          <span
            onClick={onRegister}
            className="text-gray-500 focus:outline-none focus:underline cursor-pointer"
          >
            Register
          </span>
        </div>
      </form>
    </>
  );
};

export default Login;
