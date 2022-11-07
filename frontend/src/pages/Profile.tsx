import { BsBoxSeam } from 'react-icons/bs';
import { AiOutlineUser } from 'react-icons/ai';
import { FiPower } from 'react-icons/fi';
import { useQuery } from 'react-query';
import { UserService } from '../api';
import PersonalData from '../components/profile/PersonalData';
const Profile = () => {
  const fetchUser = useQuery('user', () => UserService.getUser(), {
    staleTime: Infinity,
  });
  if (fetchUser.isError) {
    return <div>Error...</div>;
  }
  if (fetchUser.isLoading) {
    return <div>Loading...</div>;
  }

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
        <section className="side-panel inset-0 flex w-52 flex-col gap-y-[2px] border-x border-gray-100  h-fit font-medium text-gray-400">
          <div className="place-items-center w-full  font-bold text-[1.1rem ] gap-x-3 py-4 pl-4 border-y  border-gray-100">
            <span>Howdy, {fetchUser.data?.name}</span>
          </div>
          <div className="flex cursor-pointer place-items-center w-full  font-medium gap-x-3 py-4 pl-6 hover:text-black border-b border-gray-100">
            <span className="text-xl">
              <AiOutlineUser />
            </span>
            <span>Personal Data</span>
          </div>
          <div className="flex cursor-pointer place-items-center w-full  font-medium gap-x-3 py-4 pl-6 hover:text-black border-b border-gray-100">
            <span className="text-xl">
              <BsBoxSeam />
            </span>
            <span>Orders</span>
          </div>
          <div className="flex cursor-pointer place-items-center w-full  font-medium gap-x-3 py-4 pl-6 hover:text-black border-b border-gray-100">
            <span className="text-xl">
              <FiPower />
            </span>
            <span>Log Out</span>
          </div>
        </section>
        <section className="wrapper pl-5 pt-3 w-full mb-8">
          <PersonalData />
        </section>
      </div>
    </main>
  );
};
export default Profile;
