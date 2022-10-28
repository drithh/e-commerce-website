import { useContext, useEffect, useReducer } from 'react';
import Cookies from 'js-cookie';

import wishlistReducer from './wishlistReducer';
import WishlistContext from './WishlistContext';
import {
  ADD_TO_WISHLIST,
  DELETE_WISHLIST_ITEM,
  CLEAR_WISHLIST,
  itemType,
  wishlistType,
  SET_WISHLIST,
} from './wishlist-type';

export const ProvideWishlist = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const value = useProvideWishlist();
  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

const useProvideWishlist = () => {
  const initPersistState: wishlistType = { wishlist: [] };
  const [state, dispatch] = useReducer(wishlistReducer, initPersistState);

  useEffect(() => {
    const initialWishlist = Cookies.get('wishlist');
    if (initialWishlist) {
      const wishlistItems = JSON.parse(initialWishlist as string);
      dispatch({ type: SET_WISHLIST, payload: wishlistItems });
    }
  }, []);

  useEffect(() => {
    Cookies.set('wishlist', JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  const addToWishlist = (item: itemType) => {
    dispatch({
      type: ADD_TO_WISHLIST,
      payload: item,
    });
  };

  const deleteWishlistItem = (item: itemType) => {
    dispatch({
      type: DELETE_WISHLIST_ITEM,
      payload: item,
    });
  };

  const clearWishlist = () => {
    dispatch({
      type: CLEAR_WISHLIST,
    });
  };

  const value: wishlistType = {
    wishlist: state.wishlist,
    addToWishlist,
    deleteWishlistItem,
    clearWishlist,
  };

  return value;
};
