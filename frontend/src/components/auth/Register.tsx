import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import Button from '../button/Button';
import Input from '../input/Input';

type Props = {
  onLogin: () => void;
  errorMsg: string;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
};

const Register: React.FC<Props> = ({ onLogin, errorMsg, setErrorMsg }) => {
  // const auth = useAuth();
  let auth: any;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const regResponse = await auth.register!(
      email,
      name,
      password,
      address,
      phone
    );
    if (regResponse.success) {
    } else {
      if (regResponse.message === 'alreadyExists') {
        setErrorMsg('email_already_exists');
      } else {
        setErrorMsg('error_occurs');
      }
    }
  };

  // auth.user ? console.log(auth.user) : console.log('No User');

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
          placeholder={'Shipping Address *'}
          name="shipping_address"
          extraClass="w-full focus:border-gray-500"
          border="border-2 border-gray-300 mb-4"
          onChange={(e) => setAddress((e.target as HTMLInputElement).value)}
          value={address}
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
          <div className="text-red mb-2 whitespace-nowrap text-sm">
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
