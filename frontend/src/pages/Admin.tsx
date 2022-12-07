import React from 'react';
import { AiOutlinePicCenter, AiOutlineUser } from 'react-icons/ai';
import { BsBookmark } from 'react-icons/bs';
import { IoShirtOutline } from 'react-icons/io5';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { SlGraph } from 'react-icons/sl';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <main
      id="main-content"
      className="relative mx-auto mt-20 min-h-screen w-screen overflow-hidden  border-t border-gray-100 2xl:w-[90rem]"
    >
      {/* ===== Heading ===== */}
      <div className="w-full  ">
        <h1 className="mt-6 mb-2 text-center text-2xl sm:text-left sm:text-4xl">
          Dashboard
        </h1>
      </div>
      <div className="mt-4 flex gap-x-4">
        {/* ===== Side Panel Section ===== */}
        <section className="side-panel inset-0 flex h-fit flex-col gap-y-[2px]   border-[1.5px] border-gray-500 py-2 px-5 font-medium text-gray-400">
          <Link
            to=""
            className={`${
              location.pathname === '/admin' && 'text-black'
            } flex w-full cursor-pointer place-items-center  gap-x-3 border-b-2 border-gray-100 py-4 px-6 font-medium uppercase hover:text-black`}
          >
            <span className="text-xl">
              <SlGraph />
            </span>
            Dashboard
          </Link>
          <Link
            to="banners"
            className={`${
              location.pathname === '/admin/banners' && 'text-black'
            } flex w-full cursor-pointer place-items-center  gap-x-3 border-b-2 border-gray-100 py-4 px-6 font-medium uppercase hover:text-black`}
          >
            <span className="text-xl">
              <AiOutlinePicCenter />
            </span>
            Banners
          </Link>
          <Link
            to="orders"
            className={`${
              location.pathname === '/admin/orders' && 'text-black'
            } flex w-full cursor-pointer place-items-center  gap-x-3 border-b-2 border-gray-100 py-4 px-6 font-medium uppercase hover:text-black`}
          >
            <span className="text-xl">
              <MdOutlineAttachMoney />
            </span>
            Orders
          </Link>
          <Link
            to="products"
            className={`${
              location.pathname === '/admin/products' && 'text-black'
            } flex w-full cursor-pointer place-items-center  gap-x-3 border-b-2 border-gray-100 py-4 px-6 font-medium uppercase hover:text-black`}
          >
            <span className="text-xl">
              <IoShirtOutline />
            </span>
            Products
          </Link>
          <Link
            to="categories"
            className={`${
              location.pathname === '/admin/categories' && 'text-black'
            } flex w-full cursor-pointer place-items-center  gap-x-3 border-b-2 border-gray-100 py-4 px-6 font-medium uppercase hover:text-black`}
          >
            <span className="text-xl">
              <BsBookmark />
            </span>
            Categories
          </Link>
          <Link
            to="customers"
            className={`${
              location.pathname === '/admin/customers' && 'text-black'
            } flex w-full cursor-pointer place-items-center  gap-x-3 py-4 px-6 font-medium uppercase hover:text-black`}
          >
            <span className="text-xl">
              <AiOutlineUser />
            </span>
            Customers
          </Link>
        </section>
        <section className="wrapper w-full overflow-hidden">
          <Outlet />
        </section>
      </div>
    </main>
  );
};

export default Admin;
