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
        <div className="max-w-6xl w-full">
          <div className={`flex justify-between align-baseline `}>
            {/* Left Nav */}
            <ul className={`flex-0 lg:flex-1 flex gap-x-4 place-items-center`}>
              <li>
                <Link to={`/product-category/men`}>{'men'}</Link>
              </li>
              <li>
                <Link to={`/product-category/women`}>{'women'}</Link>
              </li>
              <li>
                <Link to="/product-category/bags">{'bags'}</Link>
              </li>
              <li>
                <Link to="/coming-soon">{'blogs'}</Link>
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
            <ul className={`flex-1 flex justify-end gap-x-8`}>
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
