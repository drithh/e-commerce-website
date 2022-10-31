import LeftArrow from '../assets/icons/LeftArrow';
import Button from '../components/button/Button';
import GhostButton from '../components/button/GhostButton';
import { Link } from 'react-router-dom';
import { useCart } from '../context/cart/CartProvider';
import { useWishlist } from '../context/wishlist/WishlistProvider';

const Wishlist = () => {
  // const t = useTranslations('CartWishlist');
  const { addOne } = useCart();
  const { wishlist, deleteWishlistItem, clearWishlist } = useWishlist();

  let subtotal = 0;

  return (
    <main id="main-content" className="mx-auto mt-20 min-h-[60vh] max-w-7xl">
      {/* ===== Heading & Continue Shopping */}
      <div className="app-max-width w-full border-t-2 border-gray-100 px-4 sm:px-8 md:px-20">
        <h1 className="animatee__animated animate__bounce mt-6 mb-2 text-center text-2xl sm:text-left sm:text-4xl">
          Wishlist
        </h1>
        <div className="mt-6 mb-3">
          <Link to="/" className="inline-block">
            <LeftArrow size="sm" extraClass="inline-block" /> Continue Shopping
          </Link>
        </div>
      </div>

      {/* ===== Wishlist Table Section ===== */}
      <div className="app-max-width mb-14 flex flex-col px-4 sm:px-8 md:px-20 lg:flex-row">
        <div className="h-full w-full">
          <table className="mb-6 w-full">
            <thead>
              <tr className="border-t-2 border-b-2 border-gray-200">
                <th className="hidden py-2 text-left font-normal sm:text-center md:table-cell xl:w-72">
                  Product Image
                </th>
                <th className="hidden py-2 text-left font-normal sm:text-center md:table-cell xl:w-72">
                  Product Name
                </th>
                <th className="py-2 text-left font-normal sm:text-center md:hidden xl:w-72">
                  Product Detail
                </th>
                <th
                  className={`py-2 font-normal ${
                    wishlist.length === 0 ? 'text-center' : 'text-right'
                  }`}
                >
                  Unit Price
                </th>
                <th className="hidden max-w-xs py-2 font-normal sm:table-cell">
                  Add
                </th>
                <th className="hidden w-10 whitespace-nowrap py-2 text-right font-normal sm:table-cell">
                  Remove
                </th>
                <th className="w-10 py-2 text-right font-normal sm:hidden">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {wishlist.length === 0 ? (
                <tr className="h-60 w-full border-b-2 border-gray-200 text-center">
                  <td colSpan={5}>Whislist is empty!</td>
                </tr>
              ) : (
                wishlist.map((item) => {
                  subtotal += item.price * item.qty!;
                  return (
                    <tr className="border-b-2 border-gray-200" key={item.id}>
                      <td className="my-3 flex flex-col items-start justify-center sm:items-center">
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
                      <td className="hidden text-center md:table-cell">
                        {item.name}
                      </td>
                      <td className="text-right text-gray-400">
                        $ {item.price}
                      </td>
                      <td className="hidden max-w-xs text-center text-gray-400 sm:table-cell">
                        <Button
                          value={'Add To Cart'}
                          extraClass="hidden sm:block m-auto"
                          onClick={() => addOne!(item)}
                        />
                      </td>
                      <td
                        className="pl-8 text-right"
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
                          className="text-4xl text-gray-300 outline-none hover:text-gray-500 focus:outline-none sm:text-2xl"
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
  );
};

export default Wishlist;
