import { Fragment, useCallback, useEffect, useState } from 'react';
import { AiOutlinePieChart, AiOutlineUser } from 'react-icons/ai';
import { HiOutlineHeart, HiOutlineSearch } from 'react-icons/hi';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import { capitalCase } from 'change-case';

import { CategoryService, DetailCategory } from '../api';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import { useWishlist } from '../context/WishlistContext';
import AuthForm from './auth/AuthForm';
import CartItem from './cart/CartItem';
import PopoverMenu from './PopoverMenu';
const Header = () => {
  const { search, setSearch } = useSearch();
  let categories = new Array<{
    type: string;
    items: DetailCategory[];
  }>();
  const fetchCategories = useQuery(
    'categories',
    () => CategoryService.getCategory(),
    {
      staleTime: Infinity,
    }
  );
  const { role } = useAuth();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [didMount, setDidMount] = useState<boolean>(false);
  const { wishlist } = useWishlist();
  const [animate, setAnimate] = useState('');

  document.body.style.overflow = search ? 'hidden' : 'unset';

  const noOfWishlist = wishlist.data?.length || 0;
  // Animate Wishlist Number
  const handleAnimate = useCallback(() => {
    if (noOfWishlist === 0) return;
    setAnimate('animate__animated animate__headShake');
  }, [noOfWishlist, setAnimate]);

  // Set animate when no of wishlist changes
  useEffect(() => {
    handleAnimate();
    setTimeout(() => {
      setAnimate('');
    }, 1000);
  }, [handleAnimate]);

  const handleScroll = useCallback(() => {
    const offset = window.scrollY;
    if (offset > 30) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }, [setScrolled]);

  useEffect(() => {
    setDidMount(true);
    window.addEventListener('scroll', handleScroll);
    return () => setDidMount(false);
  }, [handleScroll]);

  if (!didMount) {
    return null;
  }
  if (fetchCategories.isLoading) {
    return <div>Loading...</div>;
  }
  if (fetchCategories.isError) {
    return <div>Error...</div>;
  }
  if (fetchCategories.data != null) {
    categories = fetchCategories.data.data.reduce<
      Array<{
        type: string;
        items: DetailCategory[];
      }>
    >((acc, curr) => {
      const type = capitalCase(curr.type, { delimiter: ' & ' });
      const existing = acc.find((item) => item.type === type);
      if (existing != null) {
        existing.items.push(curr);
      } else {
        acc.push({ type, items: [curr] });
      }
      return acc;
    }, []);
  }

  return (
    <>
      <nav
        className={`${
          scrolled ? 'bg-white shadow-md' : 'bg-transparent'
        } fixed top-0 z-50  flex  h-20 w-full place-content-center place-items-center transition-all duration-1000`}
      >
        <div className="h-full w-full 2xl:max-w-[96rem]">
          <div className="justify-content-center flex h-full justify-between align-baseline">
            {/* Left Nav */}
            <ul className="flex-0 flex place-items-center gap-x-4 lg:flex-1 ">
              {categories?.map((category, index) => (
                <li key={index} className="relative h-6">
                  <PopoverMenu
                    menuTitle={category.type}
                    linksArray={category.items.map((item) => [
                      capitalCase(item.title),
                      `/products?category=${item.id}`,
                    ])}
                  />
                </li>
              ))}
            </ul>

            {/* Tutu Logo */}
            <div className="flex flex-1 cursor-pointer items-center justify-center ">
              <div className="h-auto w-32">
                <Link to="/">
                  <div className="font-title text-4xl">TUTU</div>
                </Link>
              </div>
            </div>

            {/* Right Nav */}
            <ul className="mr-4 flex flex-1 place-items-center justify-start gap-x-8 lg:justify-end 2xl:mr-0">
              <li>
                <HiOutlineSearch
                  onClick={() => setSearch!(true)}
                  className="h-8 w-8 cursor-pointer sm:h-6 sm:w-6"
                />
              </li>
              <li>
                {role !== 'guest' ? (
                  <Link to="/profile" aria-label="Profile">
                    <AiOutlineUser className="h-8 w-8 sm:h-6 sm:w-6" />
                  </Link>
                ) : (
                  <AuthForm>
                    <AiOutlineUser className="h-8 w-8 sm:h-6 sm:w-6" />
                  </AuthForm>
                )}
              </li>

              <li>
                <Link
                  to="/wishlist"
                  aria-label="Wishlist"
                  className="h-8 w-8 sm:h-6 sm:w-6"
                >
                  {/* <a className="relative" aria-label="Wishlist"> */}
                  <button
                    type="button"
                    className="relative"
                    aria-label="Wishlist"
                  >
                    <HiOutlineHeart className="-mb-[4px] h-8 w-8 cursor-pointer sm:h-6 sm:w-6" />
                    {noOfWishlist > 0 && (
                      <span
                        className={`${animate} absolute -top-3 -right-3 rounded-full bg-gray-500 py-1 px-2 text-xs text-gray-100`}
                      >
                        {noOfWishlist}
                      </span>
                    )}
                  </button>
                  {/*  */}
                </Link>
              </li>
              <li>
                <CartItem />
              </li>
              <li>
                {role === 'admin' && (
                  <Link to="/admin" aria-label="Admin">
                    <AiOutlinePieChart className="-ml-2 -mb-1 h-8 w-8 sm:h-6 sm:w-6" />
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
