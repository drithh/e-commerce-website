import React, { useState } from 'react';

import { Dialog } from '@headlessui/react';

import { ApiError } from '../../api';
import { useAuth } from '../../context/AuthContext';
import Button from '../button/Button';
import Input from '../input/Input';
import { toast } from 'react-toastify';

interface Props {
  onLogin: () => void;
  closeModal: () => void;
}

const Register: React.FC<Props> = ({ onLogin, closeModal }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    register!.mutate(
      { name, email, password, phone },
      {
        onError: (error: ApiError) => {
          setErrorMsg(error.body.message);
        },
      }
    );
  };

  return (
    <>
      <Dialog.Title
        as="h3"
        className="my-8 text-center text-4xl font-medium leading-6 text-gray-800"
      >
        Register
      </Dialog.Title>
      <form onSubmit={handleSubmit} className="mt-2">
        <Input
          type="name"
          placeholder={'Name *'}
          name="name"
          required
          extraClass="w-full focus:border-gray-500"
          border="border-2 border-gray-300 mb-4"
          onChange={(e) => setName((e.target as HTMLInputElement).value)}
          value={name}
        />
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
        <Input
          type="text"
          placeholder={'Phone *'}
          name="phone"
          extraClass="w-full focus:border-gray-500"
          border="border-2 border-gray-300 mb-4"
          onChange={(e) => setPhone((e.target as HTMLInputElement).value)}
          value={phone}
        />
        {errorMsg !== '' && (
          <div className="mb-4 whitespace-nowrap text-sm text-red-600">
            {errorMsg}
          </div>
        )}
        <div className="mb-4 flex justify-between">
          <p className="text-xs text-gray-400">
            Your personal data will be used to support your experience
            throughout this website, to manage access to your account, and for
            other purposes described in our Privacy Policy
          </p>
        </div>
        <Button
          type="submit"
          value={'Register'}
          extraClass="w-full text-center text-xl mb-4"
          size="lg"
        />
        <div className="text-center text-gray-400">
          {'Already a member ? '}
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

export default Register;
