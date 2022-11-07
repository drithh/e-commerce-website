import { BsBoxSeam } from 'react-icons/bs';
import { AiOutlineUser } from 'react-icons/ai';
import { FiPower } from 'react-icons/fi';
import { useQuery } from 'react-query';
import { UserService } from '../api';
import PersonalData from '../components/profile/PersonalData';
import Order from '../components/profile/Order';
import { useState } from 'react';
const Profile = () => {
  const fetchUser = useQuery('user', () => UserService.getUser(), {
    staleTime: Infinity,
  });
  const [currentTab, setCurrentTab] = useState('personalData');
  if (fetchUser.isError) {
    return <div>Error...</div>;
  }
  if (fetchUser.isLoading) {
    return <div>Loading...</div>;
  }

  const logout = () => {
    console.log('logout');
  };

  return (
    <main
      id="main-content"
      className=" mt-20  min-h-[60vh]  border-t border-gray-100 max-w-7xl mx-auto"
    >
      {/* ===== Heading ===== */}
      <div className="w-full  ">
        <h1 className="animatee__animated animate__bounce mt-6 mb-2 text-center text-2xl sm:text-left sm:text-4xl">
          My Account
        </h1>
      </div>
      {/* ===== Side Panel Section ===== */}
      <div className="profile flex w-full mt-4">
        <section className="side-panel inset-0 flex w-52 flex-col gap-y-[2px] border-x border-gray-100 rounded  h-fit font-medium text-gray-400">
          <div className="place-items-center w-full  font-bold text-[1.1rem ] gap-x-3 py-4 pl-4 border-y  border-gray-100">
            <span>Howdy, {fetchUser.data?.name}</span>
          </div>
          <button
            onClick={() => setCurrentTab('personalData')}
            className="flex cursor-pointer place-items-center w-full  font-medium gap-x-3 py-4 pl-6 hover:text-black border-b border-gray-100"
          >
            <span className="text-xl">
              <AiOutlineUser />
            </span>
            <span>Personal Data</span>
          </button>
          <button
            onClick={() => setCurrentTab('order')}
            className="flex cursor-pointer place-items-center w-full  font-medium gap-x-3 py-4 pl-6 hover:text-black border-b border-gray-100"
          >
            <span className="text-xl">
              <BsBoxSeam />
            </span>
            <span>Orders</span>
          </button>
          <button
            onClick={() => logout()}
            className="flex cursor-pointer place-items-center w-full  font-medium gap-x-3 py-4 pl-6 hover:text-black border-b border-gray-100"
          >
            <span className="text-xl">
              <FiPower />
            </span>
            <span>Log Out</span>
          </button>
        </section>
        <section className="wrapper w-full mb-8">
          {currentTab === 'personalData' && <PersonalData />}
          {currentTab === 'order' && <Order />}
        </section>
      </div>
    </main>
  );
};
export default Profile;
