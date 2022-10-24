import Header from '../components/Header';
import Footer from '../components/Footer';
import LeftArrow from '../assets/icons/LeftArrow';
import Button from '../components/button/Button';
import GhostButton from '../components/button/GhostButton';
import { Link } from 'react-router-dom';
import { useCart } from '../context/cart/CartProvider';
import { useWishlist } from '../context/wishlist/WishlistProvider';

// let w = window.innerWidth;

const Wishlist = () => {
  // const t = useTranslations('CartWishlist');
  const { addOne } = useCart();
  const { wishlist, deleteWishlistItem, clearWishlist } = useWishlist();

  let subtotal = 0;

  return (
    <div>
      {/* ===== Head Section ===== */}
      <Header />

      <main id="main-content" className="max-w-7xl mx-auto mt-24 min-h-[60vh]">
        {/* ===== Heading & Continue Shopping */}
        <div className="app-max-width px-4 sm:px-8 md:px-20 w-full border-t-2 border-gray-100">
          <h1 className="text-2xl sm:text-4xl text-center sm:text-left mt-6 mb-2 animatee__animated animate__bounce">
            Wishlist
          </h1>
          <div className="mt-6 mb-3">
            <Link to="/" className="inline-block">
              <LeftArrow size="sm" extraClass="inline-block" /> Continue
              Shopping
            </Link>
          </div>
        </div>

        {/* ===== Wishlist Table Section ===== */}
        <div className="app-max-width px-4 sm:px-8 md:px-20 mb-14 flex flex-col lg:flex-row">
          <div className="h-full w-full">
            <table className="w-full mb-6">
              <thead>
                <tr className="border-t-2 border-b-2 border-gray-200">
                  <th className="font-normal hidden md:table-cell text-left sm:text-center py-2 xl:w-72">
                    Product Image
                  </th>
                  <th className="font-normal hidden md:table-cell text-left sm:text-center py-2 xl:w-72">
                    Product Name
                  </th>
                  <th className="font-normal md:hidden text-left sm:text-center py-2 xl:w-72">
                    Product Detail
                  </th>
                  <th
                    className={`font-normal py-2 ${
                      wishlist.length === 0 ? 'text-center' : 'text-right'
                    }`}
                  >
                    Unit Price
                  </th>
                  <th className="font-normal hidden sm:table-cell py-2 max-w-xs">
                    Add
                  </th>
                  <th className="font-normal hidden sm:table-cell py-2 text-right w-10 whitespace-nowrap">
                    Remove
                  </th>
                  <th className="font-normal sm:hidden py-2 text-right w-10">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {wishlist.length === 0 ? (
                  <tr className="w-full text-center h-60 border-b-2 border-gray-200">
                    <td colSpan={5}>Whislist is empty!</td>
                  </tr>
                ) : (
                  wishlist.map((item) => {
                    subtotal += item.price * item.qty!;
                    return (
                      <tr className="border-b-2 border-gray-200" key={item.id}>
                        <td className="my-3 flex justify-center flex-col items-start sm:items-center">
                          <Link to={`/products/${encodeURIComponent(item.id)}`}>
                            <img
                              src={item.img1 as string}
                              alt={item.name}
                              width={95}
                              height={128}
                              className="h-32 xl:mr-4"
                            />
                          </Link>
                          <span className="text-xs md:hidden">{item.name}</span>
                        </td>
                        <td className="text-center hidden md:table-cell">
                          {item.name}
                        </td>
                        <td className="text-right text-gray-400">
                          $ {item.price}
                        </td>
                        <td className="text-center hidden sm:table-cell max-w-xs text-gray-400">
                          <Button
                            value={'Add To Cart'}
                            extraClass="hidden sm:block m-auto"
                            onClick={() => addOne!(item)}
                          />
                        </td>
                        <td
                          className="text-right pl-8"
                          style={{ minWidth: '3rem' }}
                        >
                          <Button
                            value={'add'}
                            onClick={() => addOne!(item)}
                            extraClass="sm:hidden mb-4 whitespace-nowrap"
                          />
                          <button
                            onClick={() => deleteWishlistItem!(item)}
                            type="button"
                            className="outline-none text-gray-300 hover:text-gray-500 focus:outline-none text-4xl sm:text-2xl"
                          >
                            &#10005;
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <div>
              <GhostButton
                onClick={clearWishlist}
                extraClass="w-full sm:w-48 whitespace-nowrap"
              >
                Clear Wishlist
              </GhostButton>
            </div>
          </div>
        </div>
      </main>

      {/* ===== Footer Section ===== */}
      <Footer />
    </div>
  );
};

export default Wishlist;
