import { useEffect, useState, useCallback, Fragment } from 'react';
import { Link } from 'react-router-dom';
import WhistlistIcon from '../assets/icons/WhistlistIcon';
import UserIcon from '../assets/icons/UserIcon';
import SearchIcon from '../assets/icons/SearchIcon';
import AuthForm from './auth/AuthForm';
import CartItem from './cart/CartItem';
import { useWishlist } from '../context/wishlist/WishlistProvider';
// import DownArrow from '../assets/icons/DownArrow';
// import InstagramLogo from '../assets/icons/InstagramLogo';
// import FacebookLogo from '../assets/icons/FacebookLogo';
import PopoverMenu from './PopoverMenu';
const Header = () => {
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
          scrolled ? 'bg-white  shadow-md z-50' : 'bg-transparent'
        } w-full z-50 h-20  flex  fixed top-0 place-items-center transition-all place-content-center duration-1000`}
      >
        <div className="2xl:max-w-[96rem] w-full h-full">
          <div className="flex justify-between align-baseline h-full justify-content-center">
            {/* Left Nav */}
            <ul className="flex-0 lg:flex-1 flex gap-x-4 place-items-center ">
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

            {/* Haru Logo */}
            <div className="flex-1 flex justify-center items-center cursor-pointer ">
              <div className="w-32 h-auto">
                <Link to="/">
                  <div className="text-4xl font-title">TUTU</div>
                </Link>
              </div>
            </div>

            {/* Right Nav */}
            <ul className="flex-1 flex 2xl:mr-0 mr-4 lg:justify-end justify-start gap-x-8 place-items-center">
              <li>
                {/* <SearchForm /> */}
                <SearchIcon />
              </li>
              <li className="opacity-100">
                <AuthForm>
                  <UserIcon />
                </AuthForm>
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
                        className={`${animate} absolute text-xs -top-3 -right-3 bg-gray-500 text-gray-100 py-1 px-2 rounded-full`}
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
