import FacebookLogo from '../assets/icons/FacebookLogo';
import InstagramLogo from '../assets/icons/InstagramLogo';
import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <div className=" flex mx-auto flex-col place-content-center font-lato">
      <div className="wrapper  border-t-2 border-gray-100 py-16 w-full">
        <div className="flex max-w-6xl mx-auto">
          <div className="w-full flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="text-gray-400 text-lg mb-1 md:mb-3">Company</h3>
              <div className="flex flex-col gap-y-2">
                <a href="example">About Us</a>
                <a href="example">Contact Us</a>
              </div>
            </div>
            <div>
              <h3 className="text-gray-400 text-lg mb-1 md:mb-3">Help</h3>
              <div className="flex flex-col gap-y-2">
                <a href="example">Order Tracking</a>
                <a href="example">Faqs</a>
                <a href="example">Privacy Policy</a>
                <a href="example">Terms Conditions</a>
              </div>
            </div>
            <div>
              <h3 className="text-gray-400 text-lg mb-1 md:mb-3">Store</h3>
              <div className="flex flex-col gap-y-2">
                <Link to={`/product-category/women`}>Women</Link>
                <Link to={`/product-category/men`}>Men</Link>
                <Link to={`/product-category/bags`}>Bags</Link>
              </div>
            </div>
            <div>
              <h3 className="text-gray-400 text-lg mb-1 md:mb-3">
                Keep In Touch
              </h3>
              <div className="flex flex-col gap-y-2">
                <div>
                  123, Depan Steam
                  <br />
                  Kaplingan , Surakarta
                </div>
                <div>+6212345678</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="wrapper border-2 py-1 text-xs border-gray-200 text-gray-600">
        <div className="flex max-w-6xl mx-auto">
          <div className="app-max-width app-x-padding w-full flex justify-between">
            <span className="">@ 2022 Tutu. All Right Reserved</span>
            <span className="flex items-center gap-x-4">
              <span className="hidden sm:block">Follow Us On Social Media</span>{' '}
              <a
                href="www.facebook.com"
                aria-label="Facebook Page for Haru Fashion"
              >
                <FacebookLogo />
              </a>
              <a
                href="www.ig.com"
                aria-label="Instagram Account for Haru Fashion"
              >
                <InstagramLogo />
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
