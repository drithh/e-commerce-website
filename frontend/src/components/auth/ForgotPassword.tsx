import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useAuth } from '../../context/AuthContext';
import Button from '../button/Button';
import Input from '../input/Input';

type Props = {
  onLogin: () => void;
  errorMsg: string;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  setSuccessMsg: React.Dispatch<React.SetStateAction<string>>;
};

const ForgotPassword: React.FC<Props> = ({
  onLogin,
  errorMsg,
  setErrorMsg,
  setSuccessMsg,
}) => {
  const auth = useAuth();

  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const forgotPasswordResponse = await auth.forgotPassword!(email);
    console.log(forgotPasswordResponse);
    if (forgotPasswordResponse.success) {
      setSuccessMsg('login_successful');
    } else {
      setErrorMsg('incorrect_email_password');
    }
  };

  return (
    <>
      <Dialog.Title
        as="h3"
        className="text-3xl text-center my-8 font-medium leading-10 text-gray-800"
      >
        Forgot your password?
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
        {errorMsg !== '' && (
          <div className="text-red text-sm mb-4 whitespace-nowrap">
            {errorMsg}
          </div>
        )}
        <Button
          type="submit"
          value={'Submit'}
          extraClass="w-full text-center text-xl mb-4"
          size="lg"
        />
        <div className="text-center text-gray-400">
          Go back to{' '}
          <span
            onClick={onLogin}
            className="text-gray-500 focus:outline-none focus:underline cursor-pointer"
          >
            Login
          </span>
        </div>
      </form>
    </>
  );
};

export default ForgotPassword;
