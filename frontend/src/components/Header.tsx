import { useEffect, useState, useCallback, Fragment } from 'react';
import { Link } from 'react-router-dom';
import WhistlistIcon from '../assets/icons/WhistlistIcon';
import UserIcon from '../assets/icons/UserIcon';
import SearchIcon from '../assets/icons/SearchIcon';
import AuthForm from './auth/AuthForm';
import CartItem from './cart/CartItem';
import { useWishlist } from '../context/wishlist/WishlistProvider';
import { useRole } from '../context/RoleContext';
import PopoverMenu from './PopoverMenu';

const Header = () => {
  const { role }: any = useRole();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [didMount, setDidMount] = useState<boolean>(false);
  const { wishlist } = useWishlist();
  const [animate, setAnimate] = useState('');

  let noOfWishlist = wishlist.length;
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
              <li className="relative h-6">
                <PopoverMenu
                  menuTitle="Tops"
                  linksArray={[
                    ['T-Shirts', '/'],
                    ['Shirts', '/about'],
                    ['Coats', '/blog'],
                    ['Dresses', '/blog'],
                    ['Pullovers', '/blog'],
                  ]}
                />
              </li>
              <li className="relative h-6">
                <PopoverMenu
                  menuTitle="Bottoms"
                  linksArray={[['Trousers', '/']]}
                />
              </li>
              <li className="relative h-6">
                <PopoverMenu
                  menuTitle="Shoes & Accessories"
                  linksArray={[
                    ['Bags', '/'],
                    ['Hats', '/about'],
                    ['Sneakers', '/blog'],
                    ['Sandals', '/blog'],
                    ['Angkle Boots', '/blog'],
                  ]}
                />
              </li>
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
                {/* <SearchForm /> */}
                <SearchIcon />
              </li>
              <li className="opacity-100">
                {role !== 'public' ? (
                  <Link to="/profile">
                    <UserIcon />
                  </Link>
                ) : (
                  <AuthForm>
                    <UserIcon />
                  </AuthForm>
                )}
              </li>

              <li>
                <Link to="/wishlist">
                  {/* <a className="relative" aria-label="Wishlist"> */}
                  <button
                    type="button"
                    className="relative"
                    aria-label="Wishlist"
                  >
                    <WhistlistIcon />
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
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
