import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import Heart from '../assets/icons/Heart';
import HeartSolid from '../assets/icons/HeartSolid';
import { BestSeller, WishlistService } from '../api';
import { useWishlist } from '../context/WishlistContext';
interface Props {
  item: BestSeller;
}

const Card: FC<Props> = ({ item }) => {
  const { wishlist, addWishlistItem, deleteWishlistItem, refetch } =
    useWishlist();

  // const { wishlist, addToWishlist, deleteWishlistItem } = useWishlist();
  // const { addOne } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWLHovered, setIsWLHovered] = useState(false);

  const { id, title, price, images } = item;

  const itemLink = `/products/${encodeURIComponent(id)}`;

  const alreadyWishlisted = wishlist.data!.find(
    (item) => item.product_id === id
  );
  const handleWishlist = () => {
    alreadyWishlisted
      ? deleteWishlistItem!.mutate({ product_id: id })
      : addWishlistItem!.mutate({ id });
  };

  // if (wishlist.isLoading) {
  //   return <div>Loading...</div>;
  // }
  // const alreadyWishlisted = true;

  return (
    <div className="w-full">
      <div
        className="relative mb-1 overflow-hidden group"
        onMouseOver={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={itemLink} tabIndex={-1}>
          {!isHovered && <img src={images[0] as string} alt={title} />}
          {isHovered && (
            <img
              className="transform transition-transform duration-1000 hover:scale-110"
              src={(images[1] as string) || (images[0] as string)}
              alt={title}
            />
          )}
        </Link>
        <button
          type="button"
          className="absolute top-2 right-2 rounded-full p-1"
          aria-label="Wishlist"
          onClick={handleWishlist}
          onMouseOver={() => setIsWLHovered(true)}
          onMouseLeave={() => setIsWLHovered(false)}
        >
          {isWLHovered || alreadyWishlisted ? <HeartSolid /> : <Heart />}
        </button>
        <button
          type="button"
          // onClick={() => addOne!(item)}
          className="absolute font-lato left-0 right-1/2 z-10 mx-auto translate-x-1/2 transform whitespace-nowrap bg-white px-4 py-2 group-hover:bottom-8 font-semibold text-gray-700  transition-all duration-500 hover:bg-gray-500 hover:text-gray-100 focus:bottom-8 focus:duration-75 sm:block md:-bottom-10"
        >
          Add To Cart
        </button>
      </div>

      <div className="content font-lato">
        <Link
          to={itemLink}
          className="mb-1 block truncate text-base text-gray-700 no-underline sm:text-lg "
        >
          {title}
        </Link>
        <div className="text-gray-400">$ {price}</div>
        <button
          type="button"
          // onClick={() => addOne!(item)}
          className="text-sm font-bold uppercase sm:hidden"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default Card;
