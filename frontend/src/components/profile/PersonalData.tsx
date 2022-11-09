import { useQuery } from "react-query";
import Button from "../button/Button";
import Modal from "./Modal";
import React, { useEffect, useState } from "react";
import { ApiError, UserService } from "../../api";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
const PersonalData = () => {
  // address
  const [addressName, setAddressName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const fetchUser = useQuery("user", () => UserService.getUser(), {
    staleTime: Infinity,
  });

  useEffect(() => {
    if (fetchUser.data) {
      setAddressName(fetchUser.data.address_name || "");
      setPhoneNumber(fetchUser.data.phone_number || "");
      setAddress(fetchUser.data.address || "");
      setCity(fetchUser.data.city || "");
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
    <div className="pl-5 pt-3">
      {/*  ===== General Information ===== */}
      <h2 className="w-full text-2xl font-medium">General Information</h2>
      <div className="information flex w-full flex-col gap-y-4 py-4 text-lg text-gray-700">
        <fieldset className="w-full rounded-md border border-gray-200">
          <legend className="ml-2 pr-2 pl-1 font-semibold">Full Name</legend>
          <div className="pl-6 pb-2">{fetchUser.data?.name}</div>
        </fieldset>
        <fieldset className="w-full rounded-md border border-gray-200">
          <legend className="ml-2 pr-2 pl-1 font-semibold">Email</legend>
          <div className="pl-6 pb-2">{fetchUser.data?.email}</div>
        </fieldset>
        <div className="flex place-content-end">
          <Modal buttonText="Change Password"></Modal>
        </div>
      </div>

      {/*  ===== Your Balance ===== */}
      <h2 className="w-full text-2xl font-medium">Your Balance</h2>
      <div className="information flex w-full flex-col gap-y-4 py-4 text-lg text-gray-700">
        <fieldset className="w-full rounded-md border border-gray-200">
          <legend className="ml-2 pr-2 pl-1 font-semibold">Balance</legend>
          <div className="pl-6 pb-2">{fetchUser.data?.balance}</div>
        </fieldset>

        <div className="flex place-content-end">
          <Modal buttonText="Top Up" refetch={refetch}></Modal>
        </div>
      </div>

      {/*  ===== Your Address ===== */}
      <h2 className="w-full text-2xl font-medium">Your Address</h2>
      <form
        className="information flex w-full flex-col gap-y-4 py-4 text-lg text-gray-700 "
        onSubmit={handleSubmit}
      >
        <fieldset className="w-full rounded-md border border-gray-200 pb-2 focus-within:border-gray-700">
          <legend className="ml-2 pr-2 pl-1 font-semibold">Address Name</legend>
          <input
            className="w-full  pl-6"
            onChange={(e) =>
              setAddressName((e.target as HTMLInputElement).value)
            }
            value={addressName}
          />
        </fieldset>
        <fieldset className="w-full rounded-md border border-gray-200 pb-2 focus-within:border-gray-700">
          <legend className="ml-2 pr-2 pl-1 font-semibold">Phone Number</legend>
          <input
            className="w-full  pl-6"
            onChange={(e) =>
              setPhoneNumber((e.target as HTMLInputElement).value)
            }
            value={phoneNumber}
          />
        </fieldset>
        <fieldset className="w-full rounded-md border border-gray-200 pb-2 focus-within:border-gray-700">
          <legend className="ml-2 pr-2 pl-1 font-semibold">Address</legend>
          <input
            className="w-full  pl-6"
            onChange={(e) => setAddress((e.target as HTMLInputElement).value)}
            value={address}
          />
        </fieldset>
        <fieldset className="w-full rounded-md border border-gray-200 pb-2 focus-within:border-gray-700">
          <legend className="ml-2 pr-2 pl-1 font-semibold">City</legend>
          <input
            className="w-full  pl-6"
            onChange={(e) => setCity((e.target as HTMLInputElement).value)}
            value={city}
          />
        </fieldset>
        <div className="mt-8 flex place-content-end">
          <Button
            type="submit"
            value="Update Address"
            extraClass="w-52 text-center text-xl mb-4"
            size="lg"
          />
        </div>
      </form>
    </div>
  );
};

export default PersonalData;
