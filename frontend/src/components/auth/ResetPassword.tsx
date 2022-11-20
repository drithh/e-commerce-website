import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import Button from '../button/Button';
import Input from '../input/Input';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { ApiError } from '../../api';

type Props = {
  emailForReset: string;
  onLogin: () => void;
  errorMsg: string;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  closeModal: () => void;
};

const ResetPassword: React.FC<Props> = ({
  emailForReset,
  onLogin,
  errorMsg,
  setErrorMsg,
  closeModal,
}) => {
  // const auth = useAuth();
  const { login, resetPassword } = useAuth();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // set cursor to loading
      const resetPasswordResponse = await resetPassword!.mutateAsync({
        email: emailForReset,
        token,
        password,
      });
      toast.success(resetPasswordResponse.message);
      await login!.mutateAsync({
        email: emailForReset,
        password,
      });
      closeModal();
    } catch (err) {
      setErrorMsg((err as ApiError).body.message);
    }
  };

  return (
    <>
      <Dialog.Title
        as="h3"
        className="my-8 text-center text-3xl font-medium leading-10 text-gray-800"
      >
        Reset your password
      </Dialog.Title>
      <form onSubmit={handleSubmit} className="mt-2">
        <Input
          type="text"
          placeholder={'Code *'}
          name="code"
          required
          extraClass="w-full focus:border-gray-500"
          border="border-2 border-gray-300 mb-4"
          onChange={(e) => setToken((e.target as HTMLInputElement).value)}
          value={token}
        />
        <Input
          type="password"
          placeholder={'Your new password *'}
          name="password"
          required
          extraClass="w-full focus:border-gray-500"
          border="border-2 border-gray-300 mb-4"
          onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
          value={password}
        />
        {errorMsg !== '' && (
          <div className="text-red-600 mb-4 whitespace-nowrap text-sm">
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
            className="cursor-pointer text-gray-500 focus:underline focus:outline-none"
          >
            Login
          </span>
        </div>
      </form>
    </>
  );
};

export default ResetPassword;
