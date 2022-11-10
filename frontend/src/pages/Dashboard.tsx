import React from "react";

import { SlGraph } from "react-icons/sl";
import { MdOutlineAttachMoney } from "react-icons/md";
import { BsBookmark } from "react-icons/bs";
import { IoShirtOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import Orders from "../components/dashboard/Orders";
import { useLocation, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <main
      id="main-content"
      className="mt-20  w-screen md:w-4/5 mx-auto  border-t border-gray-100 min-h-screen"
    >
      {/* ===== Heading ===== */}
      <div className="w-full  ">
        <h1 className="  animatee__animated mt-6  animate__bounce mb-2 text-center text-2xl sm:text-left sm:text-4xl">
          Dashboard
        </h1>
      </div>
      <div className="flex mt-4 ">
        {/* ===== Side Panel Section ===== */}
        <section className="side-panel inset-0 flex h-fit flex-col gap-y-[2px]  border-[1.5px] border-gray-500 font-medium text-gray-400 py-2 px-5">
          <button
            onClick={() => navigate("")}
            className={`${
              location.pathname === "/dashboard" && "text-black"
            } flex w-full cursor-pointer place-items-center  gap-x-3 border-b-2 border-gray-100 py-4 font-medium hover:text-black uppercase px-6`}
          >
            <span className="text-xl">
              <SlGraph />
            </span>
            Dashboard
          </button>
          <button
            onClick={() => navigate("orders")}
            className={`${
              location.pathname === "/dashboard/orders" && "text-black"
            } flex w-full cursor-pointer place-items-center  gap-x-3 border-b-2 border-gray-100 py-4 font-medium hover:text-black uppercase px-6`}
          >
            <span className="text-xl">
              <MdOutlineAttachMoney />
            </span>
            Orders
          </button>
          <button
            onClick={() => navigate("products")}
            className={`${
              location.pathname === "/dashboard/products" && "text-black"
            } flex w-full cursor-pointer place-items-center  gap-x-3 border-b-2 border-gray-100 py-4 font-medium hover:text-black uppercase px-6`}
          >
            <span className="text-xl">
              <IoShirtOutline />
            </span>
            Products
          </button>
          <button
            onClick={() => navigate("categories")}
            className={`${
              location.pathname === "/dashboard/categories" && "text-black"
            } flex w-full cursor-pointer place-items-center  gap-x-3 border-b-2 border-gray-100 py-4 font-medium hover:text-black uppercase px-6`}
          >
            <span className="text-xl">
              <BsBookmark />
            </span>
            Categories
          </button>
          <button
            onClick={() => navigate("customers")}
            className={`${
              location.pathname === "/dashboard/customers" && "text-black"
            } flex w-full cursor-pointer place-items-center  gap-x-3 py-4 font-medium hover:text-black uppercase px-6`}
          >
            <span className="text-xl">
              <AiOutlineUser />
            </span>
            Customers
          </button>
        </section>
        <section className="wrapper px-5 pt-7">
          <Orders />
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
