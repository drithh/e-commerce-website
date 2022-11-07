import { useQuery } from 'react-query';
import Button from '../button/Button';
import Modal from './Modal';
import React, { useEffect, useState } from 'react';
import { ApiError, UserService } from '../../api';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
const PersonalData = () => {
  // address
  const [addressName, setAddressName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const fetchUser = useQuery('user', () => UserService.getUser(), {
    staleTime: Infinity,
  });

  useEffect(() => {
    if (fetchUser.data) {
      setAddressName(fetchUser.data.address_name || '');
      setPhoneNumber(fetchUser.data.phone_number || '');
      setAddress(fetchUser.data.address || '');
      setCity(fetchUser.data.city || '');
    }
  }, [fetchUser.data]);

  const refetch = () => {
    fetchUser.refetch();
  };

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
      },
      onError: (error) => {
        toast.error((error as ApiError).body.message);
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    ChangeAddress.mutate({ addressName, phoneNumber, address, city });
  };

  if (fetchUser.isError) {
    return <div>Error...</div>;
  }
  if (fetchUser.isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      {/*  ===== General Information ===== */}
      <h2 className="text-2xl font-medium w-full">General Information</h2>
      <div className="information flex flex-col gap-y-4 w-full py-4 text-lg text-gray-700">
        <fieldset className="border border-gray-200 rounded-md w-full">
          <legend className="font-semibold pr-2 pl-1 ml-2">Full Name</legend>
          <div className="pl-6 pb-2">{fetchUser.data?.name}</div>
        </fieldset>
        <fieldset className="border border-gray-200 rounded-md w-full">
          <legend className="font-semibold pr-2 pl-1 ml-2">Email</legend>
          <div className="pl-6 pb-2">{fetchUser.data?.email}</div>
        </fieldset>
        <div className="flex place-content-end">
          <Modal buttonText="Change Password"></Modal>
        </div>
      </div>

      {/*  ===== Your Balance ===== */}
      <h2 className="text-2xl font-medium w-full">Your Balance</h2>
      <div className="information flex flex-col gap-y-4 w-full py-4 text-lg text-gray-700">
        <fieldset className="border border-gray-200 rounded-md w-full">
          <legend className="font-semibold pr-2 pl-1 ml-2">Balance</legend>
          <div className="pl-6 pb-2">{fetchUser.data?.balance}</div>
        </fieldset>

        <div className="flex place-content-end">
          <Modal buttonText="Top Up" refetch={refetch}></Modal>
        </div>
      </div>

      {/*  ===== Your Address ===== */}
      <h2 className="text-2xl font-medium w-full">Your Address</h2>
      <form
        className="information flex flex-col gap-y-4 w-full py-4 text-lg text-gray-700 "
        onSubmit={handleSubmit}
      >
        <fieldset className="border pb-2 border-gray-200 rounded-md w-full focus-within:border-gray-700">
          <legend className="font-semibold pr-2 pl-1 ml-2">Address Name</legend>
          <input
            className="pl-6  w-full"
            onChange={(e) =>
              setAddressName((e.target as HTMLInputElement).value)
            }
            value={addressName}
          />
        </fieldset>
        <fieldset className="border pb-2 border-gray-200 rounded-md w-full focus-within:border-gray-700">
          <legend className="font-semibold pr-2 pl-1 ml-2">Phone Number</legend>
          <input
            className="pl-6  w-full"
            onChange={(e) =>
              setPhoneNumber((e.target as HTMLInputElement).value)
            }
            value={phoneNumber}
          />
        </fieldset>
        <fieldset className="border pb-2 border-gray-200 rounded-md w-full focus-within:border-gray-700">
          <legend className="font-semibold pr-2 pl-1 ml-2">Address</legend>
          <input
            className="pl-6  w-full"
            onChange={(e) => setAddress((e.target as HTMLInputElement).value)}
            value={address}
          />
        </fieldset>
        <fieldset className="border pb-2 border-gray-200 rounded-md w-full focus-within:border-gray-700">
          <legend className="font-semibold pr-2 pl-1 ml-2">City</legend>
          <input
            className="pl-6  w-full"
            onChange={(e) => setCity((e.target as HTMLInputElement).value)}
            value={city}
          />
        </fieldset>
        <div className="flex place-content-end mt-8">
          <Button
            type="submit"
            value="Update Address"
            extraClass="w-52 text-center text-xl mb-4"
            size="lg"
          />
        </div>
      </form>
    </>
  );
};

export default PersonalData;
