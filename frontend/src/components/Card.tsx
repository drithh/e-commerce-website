import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineHeart, HiHeart } from "react-icons/hi";
import { Product, BestSeller } from "../api";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { convertToCurrency } from "../components/util/utilFunc";

interface Props {
  item: BestSeller | Product;
}

const Card: FC<Props> = ({ item }) => {
  const { wishlist, addWishlistItem, deleteWishlistItem } = useWishlist();
  const { role } = useAuth();

  const [isHovered, setIsHovered] = useState(false);
  const [isWLHovered, setIsWLHovered] = useState(false);

  const { id, title, price, images } = item;

  const itemLink = `/products/${encodeURIComponent(id)}`;

  const alreadyWishlisted = wishlist.data!.find(
    (item) => item.product_id === id
  );
  const handleWishlist = () => {
    if (role !== "guest") {
      alreadyWishlisted
        ? deleteWishlistItem!.mutate({ product_id: id })
        : addWishlistItem!.mutate({ id });
    }
  };

  return (
    <div className="w-60">
      <div
        className="group relative mb-1 overflow-hidden"
        onMouseOver={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={itemLink} tabIndex={-1}>
          <img
            src={images[0] as string}
            alt={title}
            loading="lazy"
            className={`${
              isHovered ? "hidden" : "animate__fadeIn"
            } h-80 animate__animated  object-cover`}
          />
          <img
            className={`${
              !isHovered ? "hidden" : ""
            } h-80 transform object-cover transition-transform duration-1000 hover:scale-110`}
            src={(images[1] as string) || (images[0] as string)}
            alt={title}
          />
        </Link>
        <button
          type="button"
          className="absolute top-2 right-2 rounded-full p-1 text-2xl"
          aria-label="Wishlist "
          onClick={handleWishlist}
          onMouseOver={() => setIsWLHovered(true)}
          onMouseLeave={() => setIsWLHovered(false)}
        >
          {isWLHovered || alreadyWishlisted ? (
            <HiHeart className="text-red-500" />
          ) : (
            <HiOutlineHeart className="text-gray-500" />
          )}
        </button>
        <Link
          to={itemLink}
          className="absolute left-0 right-1/2 z-10 mx-auto translate-x-1/2 transform whitespace-nowrap bg-white px-4 py-2 font-lato font-semibold text-gray-700 transition-all  duration-500 hover:bg-gray-500 hover:text-gray-100 focus:bottom-8 focus:duration-75 group-hover:bottom-8 sm:block md:-bottom-10"
        >
          See Details
        </Link>
      </div>

      <div className="content font-lato">
        <Link
          to={itemLink}
          className="mb-1 block truncate text-base text-gray-700 no-underline sm:text-lg "
        >
          {title}
        </Link>
        <div className="text-gray-400">{convertToCurrency(price)}</div>
        <Link to={itemLink} className="text-sm font-bold uppercase sm:hidden">
          See Details
        </Link>
      </div>
    </div>
  );
};

export default Card;
