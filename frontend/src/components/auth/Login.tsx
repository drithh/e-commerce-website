import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useAuth } from '../../context/AuthContext';
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
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loginResponse = await auth.login!(email, password);
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
        className="my-8 text-center text-4xl font-medium leading-6 text-gray-800"
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
          <div className="text-red mb-4 whitespace-nowrap text-sm">
            {errorMsg}
          </div>
        )}
        <div className="mb-4 flex justify-between">
          <div className="flex items-center text-gray-400 focus:outline-none">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              className="mb-0 mr-2 h-4 w-4"
            />
            <label htmlFor="remember" className="text-sm">
              Remember me?
            </label>
          </div>
          <span
            onClick={onForgotPassword}
            className="cursor-pointer text-sm text-gray-400 hover:text-gray-500 focus:text-gray-500 focus:outline-none"
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
            className="cursor-pointer text-gray-500 focus:underline focus:outline-none"
          >
            Register
          </span>
        </div>
      </form>
    </>
  );
};

export default Login;
