import { BsBoxSeam } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import { FiPower } from "react-icons/fi";
import { useQuery } from "react-query";
import { UserService } from "../api";
import PersonalData from "../components/profile/PersonalData";
import Order from "../components/profile/Order";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const fetchUser = useQuery("user", () => UserService.getUser(), {
    staleTime: Infinity,
  });

  useEffect(() => {
    if (location.pathname === "/profile") {
      navigate("/profile/personal-data", { replace: true });
    }
  }, [location.pathname, navigate]);

  if (fetchUser.isError) {
    return <div>Error...</div>;
  }
  if (fetchUser.isLoading) {
    return <div>Loading...</div>;
  }

  const logoutAccount = () => {
    logout && logout();
    navigate("0", { replace: true });
  };

  return (
    <main
      id="main-content"
      className="mx-auto mt-20 min-h-[60vh] max-w-7xl border-t border-gray-100"
    >
      {/* ===== Heading ===== */}
      <div className="w-full  ">
        <h1 className="  animatee__animated mt-6  animate__bounce mb-2 text-center text-2xl sm:text-left sm:text-4xl">
          My Account
        </h1>
      </div>
      {/* ===== Side Panel Section ===== */}
      <div className="profile mt-4 flex w-full">
        <section className="side-panel inset-0 flex h-fit w-52 flex-col gap-y-[2px] rounded border-x  border-gray-100 font-medium text-gray-400">
          <div className="text-[1.1rem ]  w-full place-items-center gap-x-3 border-y border-gray-100 py-4 pl-4  font-bold">
            <span>Howdy, {fetchUser.data?.name}</span>
          </div>
          <button
            onClick={() => navigate("personal-data")}
            className={`${
              location.pathname === "/profile/personal-data" && "text-black"
            }
            flex w-full cursor-pointer place-items-center  gap-x-3 border-b border-gray-100 py-4 pl-6 font-medium hover:text-black`}
          >
            <span className="text-xl">
              <AiOutlineUser />
            </span>
            <span>Personal Data</span>
          </button>
          <button
            onClick={() => navigate("order")}
            className={`${
              location.pathname === "/profile/order" && "text-black"
            }
            flex w-full cursor-pointer place-items-center  gap-x-3 border-b border-gray-100 py-4 pl-6 font-medium hover:text-black`}
          >
            <span className="text-xl">
              <BsBoxSeam />
            </span>
            <span>Orders</span>
          </button>
          <button
            onClick={() => logoutAccount()}
            className="flex w-full cursor-pointer place-items-center  gap-x-3 border-b border-gray-100 py-4 pl-6 font-medium hover:text-black"
          >
            <span className="text-xl">
              <FiPower />
            </span>
            <span>Log Out</span>
          </button>
        </section>
        <section className="wrapper mb-8 w-full">
          {location.pathname === "/profile/personal-data" && <PersonalData />}
          {location.pathname === "/profile/order" && <Order />}
        </section>
      </div>
    </main>
  );
};
export default Profile;
