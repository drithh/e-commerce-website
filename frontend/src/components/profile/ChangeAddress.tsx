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

const ChangeAddress: React.FC<Props> = ({ closeModal }) => {
  const [addressName, setAddressName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const ChangeAddress = useMutation(
    (variables: {
      addressName: string;
      phoneNumber: string;
      address: string;
      city: string;
    }) =>
      UserService.putUserShippingAddress({
        address_name: variables.addressName,
        phone_number: variables.phoneNumber,
        address: variables.address,
        city: variables.city,
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
    ChangeAddress.mutate({ addressName, phoneNumber, address, city });
  };

  return (
    <>
      <Dialog.Title
        as="h3"
        className="my-8 text-center text-4xl font-medium leading-6 text-gray-800"
      >
        Change Address
      </Dialog.Title>
      <form onSubmit={handleSubmit} className="mt-2">
        <Input
          type="text"
          placeholder={'Address Name *'}
          name="addressName"
          required
          extraClass={`w-full focus:border-gray-500 mb-4 ${
            errorMsg ? 'border-red-300' : ''
          }`}
          border="border-2 border-gray-300 mb-4"
          onChange={(e) => setAddressName((e.target as HTMLInputElement).value)}
          value={addressName}
        />
        <Input
          type="text"
          placeholder={'Phone Number *'}
          name="phoneNumber"
          required
          extraClass={`w-full focus:border-gray-500 mb-4 ${
            errorMsg ? 'border-red-300' : ''
          }`}
          border="border-2 border-gray-300"
          onChange={(e) => setPhoneNumber((e.target as HTMLInputElement).value)}
          value={phoneNumber}
        />
        <Input
          type="text"
          placeholder={'Address *'}
          name="address"
          required
          extraClass={`w-full focus:border-gray-500 mb-4 ${
            errorMsg ? 'border-red-300' : ''
          }`}
          border="border-2 border-gray-300"
          onChange={(e) => setAddress((e.target as HTMLInputElement).value)}
          value={address}
        />

        <Input
          type="text"
          placeholder={'City *'}
          name="city"
          required
          extraClass={`w-full focus:border-gray-500 mb-4 ${
            errorMsg ? 'border-red-300' : ''
          }`}
          border="border-2 border-gray-300"
          onChange={(e) => setCity((e.target as HTMLInputElement).value)}
          value={city}
        />
        {errorMsg !== '' && (
          <div className="mb-4 whitespace-nowrap text-sm text-red-600">
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

export default ChangeAddress;
