import { useState } from 'react';
import { HiOutlineChevronLeft } from 'react-icons/hi';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ApiError, UserService } from '../../api';
import Button from '../button/Button';
import Input from '../input/Input';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Customer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [balance, setBalance] = useState(0);
  const [addressName, setAddressName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const updateUser = useMutation(
    (variables: {
      id: string;
      name: string;
      email: string;
      balance: number;
      addressName: string;
      phoneNumber: string;
      address: string;
      city: string;
    }) =>
      UserService.updateUser({
        id: variables.id,
        name: variables.name,
        email: variables.email,
        balance: variables.balance,
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

  const deleteUser = useMutation((id: string) => UserService.deleteUser(id), {
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries('users');
      navigate('/admin/users');
    },
    onError: (error) => {
      toast.error((error as ApiError).body.message);
    },
  });

  const fetchUser = useQuery(
    ['user-detail', id],
    () => UserService.getDetailUser(id as string),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setName(data.name);
        setEmail(data.email);
        setBalance(data.balance);
        setAddressName(data.address_name ?? '');
        setPhoneNumber(data.phone_number ?? '');
        setAddress(data.address ?? '');
        setCity(data.city ?? '');
      },
    }
  );

  if (fetchUser.isLoading || id === undefined) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateUser.mutate({
      id,
      name,
      email,
      balance,
      addressName,
      phoneNumber,
      address,
      city,
    });
  };

  return (
    <>
      <h2 className="w-full text-2xl font-medium">Update Category</h2>
      <div className="py-3 flex ">
        <Link
          to="/admin/customers"
          className="flex place-items-center  gap-x-2"
        >
          <HiOutlineChevronLeft className="text-xl" />
          Go Back
        </Link>
      </div>
      <form
        className="information flex w-full flex-col gap-y-4 py-4 text-lg text-gray-700 "
        onSubmit={handleSubmit}
      >
        <div className="">
          <label htmlFor="name" className="text-lg">
            Name
          </label>
          <Input
            name="name"
            type="text"
            extraClass="w-full mt-1 mb-2"
            border="border-2 border-gray-400"
            value={name}
            onChange={(e) => setName((e.target as HTMLInputElement).value)}
            required
          />
        </div>
        <div className="">
          <label htmlFor="email" className="text-lg">
            Email
          </label>
          <Input
            name="email"
            type="email"
            extraClass="w-full mt-1 mb-2"
            border="border-2 border-gray-400"
            value={email}
            onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
            required
          />
        </div>
        <div className="">
          <label htmlFor="balance" className="text-lg">
            Balance
          </label>
          <Input
            name="balance"
            type="number"
            extraClass="w-full mt-1 mb-2"
            border="border-2 border-gray-400"
            value={balance.toString()}
            onChange={(e) =>
              setBalance(Number((e.target as HTMLInputElement).value))
            }
            required
          />
        </div>
        <div className="">
          <label htmlFor="addressName" className="text-lg">
            Address Name
          </label>
          <Input
            name="addressName"
            type="text"
            extraClass="w-full mt-1 mb-2"
            border="border-2 border-gray-400"
            value={addressName}
            onChange={(e) =>
              setAddressName((e.target as HTMLInputElement).value)
            }
            required
          />
        </div>
        <div className="">
          <label htmlFor="phoneNumber" className="text-lg">
            Phone Number
          </label>
          <Input
            name="phoneNumber"
            type="text"
            extraClass="w-full mt-1 mb-2"
            border="border-2 border-gray-400"
            value={phoneNumber}
            onChange={(e) =>
              setPhoneNumber((e.target as HTMLInputElement).value)
            }
            required
          />
        </div>
        <div className="">
          <label htmlFor="address" className="text-lg">
            Address
          </label>
          <Input
            name="address"
            type="text"
            extraClass="w-full mt-1 mb-2"
            border="border-2 border-gray-400"
            value={address}
            onChange={(e) => setAddress((e.target as HTMLInputElement).value)}
            required
          />
        </div>
        <div className="">
          <label htmlFor="city" className="text-lg">
            City
          </label>
          <Input
            name="city"
            type="text"
            extraClass="w-full mt-1 mb-2"
            border="border-2 border-gray-400"
            value={city}
            onChange={(e) => setCity((e.target as HTMLInputElement).value)}
            required
          />
        </div>

        <div className="mt-8 flex place-content-between">
          <button
            type="button"
            onClick={() => deleteUser.mutate(id)}
            className="text-xl sm:text-base py-3 sm:py-2 px-6 border border-gray-500 w-52 text-center  mb-4 hover:bg-gray-500 hover:text-gray-100"
            aria-label="Delete User"
          >
            Delete User
          </button>
          <Button
            type="submit"
            value="Update User"
            extraClass="w-52 text-center text-xl mb-4"
            size="lg"
          />
        </div>
      </form>
    </>
  );
};

export default Customer;
