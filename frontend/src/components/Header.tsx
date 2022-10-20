import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

// import WhistlistIcon from '../../public/icons/WhistlistIcon';
// import UserIcon from '../../public/icons/UserIcon';
// import AuthForm from '../Auth/AuthForm';
// import SearchForm from '../SearchForm/SearchForm';
// import CartItem from '../CartItem/CartItem';
// import { useWishlist } from '../../context/wishlist/WishlistProvider';

type Props = {
  title?: string;
};

const Header: React.FC<Props> = ({ title }) => {
  // const { wishlist } = useWishlist();
  // const [animate, setAnimate] = useState('');
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [didMount, setDidMount] = useState<boolean>(false); // to disable Can't perform a React state Warning

  // Calculate Number of Wishlist
  // let noOfWishlist = wishlist.length;

  // Animate Wishlist Number
  // const handleAnimate = useCallback(() => {
  //   if (noOfWishlist === 0) return;
  //   setAnimate('animate__animated animate__headShake');
  // }, [noOfWishlist, setAnimate]);

  // Set animate when no of wishlist changes
  // useEffect(() => {
  //   handleAnimate();
  //   setTimeout(() => {
  //     setAnimate('');
  //   }, 1000);
  // }, [handleAnimate]);

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
      {/* ===== Main Navigation ===== */}
      <nav
        className={`${
          scrolled ? 'bg-white sticky top-0 shadow-md z-50' : 'bg-transparent'
        } w-full z-50 h-20 relative`}
      >
        <div className="app-max-width w-full">
          <div
            className={`flex justify-between align-baseline app-x-padding py-6`}
          >
            {/* Hamburger Menu and Mobile Nav */}
            <div className="flex-1 lg:flex-0 lg:hidden">{/* <Menu /> */}</div>

            {/* Left Nav */}
            <ul
              className={`flex-0 lg:flex-1 flex mr-12 lg:block whitespace-nowrap`}
            >
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
            <div className="flex-1 flex justify-center items-center cursor-pointer">
              <div className="w-32 h-auto">
                <Link to="/">
                  <img
                    className="justify-center"
                    src="/logo.svg"
                    alt="of the author"
                    width={220}
                    height={50}
                  />
                </Link>
              </div>
            </div>

            {/* Right Nav */}
            <ul className={`flex-1 flex justify-end ml-12`}>
              {/* <li>
                <SearchForm />
              </li>
              <li>
                <AuthForm>
                  <UserIcon />
                </AuthForm>
              </li> */}
              <li>
                <Link to="/wishlist">
                  {/* <a className="relative" aria-label="Wishlist"> */}
                  <button
                    type="button"
                    className="relative"
                    aria-label="Wishlist"
                  >
                    {/* <WhistlistIcon /> */}
                    {/* {noOfWishlist > 0 && (
                      <span
                        className={`${animate} absolute text-xs -top-3 -right-3 bg-gray500 text-gray100 py-1 px-2 rounded-full`}
                      >
                        {noOfWishlist}
                      </span>
                    )} */}
                  </button>
                  {/* </a> */}
                </Link>
              </li>
              <li>{/* <CartItem /> */}</li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
