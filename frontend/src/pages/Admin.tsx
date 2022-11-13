import React from "react";

import { SlGraph } from "react-icons/sl";
import { MdOutlineAttachMoney } from "react-icons/md";
import { BsBookmark } from "react-icons/bs";
import { IoShirtOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <main
      id="main-content"
      className="mt-20 relative w-screen 2xl:w-[90rem] overflow-hidden mx-auto  border-t border-gray-100 min-h-screen"
    >
      {/* ===== Heading ===== */}
      <div className="w-full  ">
        <h1 className="mt-6 mb-2 text-center text-2xl sm:text-left sm:text-4xl">
          Dashboard
        </h1>
      </div>
      <div className="flex mt-4 gap-x-4">
        {/* ===== Side Panel Section ===== */}
        <section className="side-panel inset-0 flex h-fit flex-col gap-y-[2px]   border-[1.5px] border-gray-500 font-medium text-gray-400 py-2 px-5">
          <button
            onClick={() => navigate("")}
            className={`${
              location.pathname === "/admin" && "text-black"
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
              location.pathname === "/admin/orders" && "text-black"
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
              location.pathname === "/admin/products" && "text-black"
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
              location.pathname === "/admin/categories" && "text-black"
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
              location.pathname === "/admin/customers" && "text-black"
            } flex w-full cursor-pointer place-items-center  gap-x-3 py-4 font-medium hover:text-black uppercase px-6`}
          >
            <span className="text-xl">
              <AiOutlineUser />
            </span>
            Customers
          </button>
        </section>
        <section className="wrapper overflow-hidden w-full">
          <Outlet />
        </section>
      </div>
    </main>
  );
};

export default Admin;
