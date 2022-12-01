import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { Dialog } from '@headlessui/react';

import { ApiError, UserService } from '../../api';
import Button from '../button/Button';
import Input from '../input/Input';

interface Props {
  closeModal: () => void;
}

const TopUp: React.FC<Props> = ({ closeModal }) => {
  const [balance, setBalance] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const topUp = useMutation(
    (variables: { balance: number }) =>
      UserService.updateUserBalance({
        balance: variables.balance,
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
    topUp.mutate({ balance });
  };

  return (
    <>
      <Dialog.Title
        as="h3"
        className="my-8 text-center text-4xl font-medium leading-6 text-gray-800"
      >
        Top Up Balance
      </Dialog.Title>
      <form onSubmit={handleSubmit} className="mt-2">
        <Input
          type="number"
          placeholder={'Amount *'}
          name="amount"
          required
          extraClass={`w-full focus:border-gray-500 mb-4 ${
            errorMsg ? 'border-red-300' : ''
          }`}
          border="border-2 border-gray-300 mb-4"
          onChange={(e) =>
            setBalance(Number((e.target as HTMLInputElement).value))
          }
          value={balance.toString()}
        />
        {errorMsg !== '' && (
          <div className="mb-4 whitespace-nowrap text-sm text-red-600">
            {errorMsg}
          </div>
        )}

        <Button
          type="submit"
          value="Top Up"
          extraClass="w-full text-center text-xl mb-4"
          size="lg"
        />
      </form>
    </>
  );
};

export default TopUp;
