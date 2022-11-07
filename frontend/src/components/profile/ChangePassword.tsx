import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import Button from '../button/Button';
import Input from '../input/Input';
import { ApiError, AuthenticationService } from '../../api';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

type Props = {
  closeModal: () => void;
};

const ChangePassword: React.FC<Props> = ({ closeModal }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const changePassword = useMutation(
    (variables: { currentPassword: string; newPassword: string }) =>
      AuthenticationService.changePassword({
        old_password: variables.currentPassword,
        new_password: variables.newPassword,
      }),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        closeModal();
      },
      onError: (error) => {
        setErrorMsg((error as ApiError).body.message);
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    changePassword.mutate({ currentPassword, newPassword });
  };

  return (
    <>
      <Dialog.Title
        as="h3"
        className="my-8 text-center text-4xl font-medium leading-6 text-gray-800"
      >
        Change Password
      </Dialog.Title>
      <form onSubmit={handleSubmit} className="mt-2">
        <Input
          type="password"
          placeholder={'Current Password *'}
          name="password"
          required
          extraClass={`w-full focus:border-gray-500 mb-4 ${
            errorMsg ? 'border-red-300' : ''
          }`}
          border="border-2 border-gray-300 mb-4"
          onChange={(e) =>
            setCurrentPassword((e.target as HTMLInputElement).value)
          }
          value={currentPassword}
        />
        <Input
          type="password"
          placeholder={'New Password *'}
          name="password"
          required
          extraClass={`w-full focus:border-gray-500 mb-4 ${
            errorMsg ? 'border-red-300' : ''
          }`}
          border="border-2 border-gray-300"
          onChange={(e) => setNewPassword((e.target as HTMLInputElement).value)}
          value={newPassword}
        />
        {errorMsg !== '' && (
          <div className="text-red-600 mb-4 whitespace-nowrap text-sm">
            {errorMsg}
          </div>
        )}

        <Button
          type="submit"
          value="Change Password"
          extraClass="w-full text-center text-xl mb-4"
          size="lg"
        />
      </form>
    </>
  );
};

export default ChangePassword;
