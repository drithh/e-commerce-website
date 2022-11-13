import { useQuery } from "react-query";
import Button from "../button/Button";
import Modal from "./Modal";
import React, { useEffect, useState } from "react";
import { ApiError, UserService } from "../../api";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import LegendInput from "../input/LegendInput";
const PersonalData = () => {
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
        <LegendInput
          name="name"
          label="Full Name"
          value={fetchUser.data?.name}
          readOnly={true}
        />
        <LegendInput
          name="email"
          label="Email"
          value={fetchUser.data?.email}
          readOnly={true}
        />
        <div className="flex place-content-end">
          <Modal buttonText="Change Password"></Modal>
        </div>
      </div>

      {/*  ===== Your Balance ===== */}
      <h2 className="w-full text-2xl font-medium">Your Balance</h2>
      <div className="information flex w-full flex-col gap-y-4 py-4 text-lg text-gray-700">
        <LegendInput
          name="balance"
          label="Balance"
          type="number"
          value={fetchUser.data?.balance}
          readOnly={true}
        />

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
        <LegendInput
          name="address-name"
          label="Address Name"
          value={addressName}
          onChange={(e) => setAddressName((e.target as HTMLInputElement).value)}
        />
        <LegendInput
          name="phone-number"
          label="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber((e.target as HTMLInputElement).value)}
        />
        <LegendInput
          name="address"
          label="Address"
          value={address}
          onChange={(e) => setAddress((e.target as HTMLInputElement).value)}
        />
        <LegendInput
          name="city"
          label="City"
          value={city}
          onChange={(e) => setCity((e.target as HTMLInputElement).value)}
        />
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
