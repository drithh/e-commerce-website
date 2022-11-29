import React, { createContext, useContext, useState } from 'react';

import { WishlistService, GetWishlist, DefaultResponse } from '../api';
import { UseMutationResult, useQuery } from 'react-query';
import { useMutation } from 'react-query';
import { useAuth } from './AuthContext';

export type wishlistType = {
  wishlist: GetWishlist;
  setWishlist?: React.Dispatch<React.SetStateAction<GetWishlist>>;
  refetch?: () => void;
  deleteWishlistItem?: UseMutationResult<
    DefaultResponse,
    unknown,
    {
      product_id: string;
    },
    unknown
  >;
  addWishlistItem?: UseMutationResult<
    DefaultResponse,
    unknown,
    {
      id: string;
    },
    unknown
  >;
  clearWishlist?: UseMutationResult<DefaultResponse, unknown, void, unknown>;
};

const WishlistContext = createContext<wishlistType>({
  wishlist: {
    data: [],
  },
});

export const useWishlist = () => useContext(WishlistContext);

interface WishlistProviderProps {
  children: React.ReactNode;
}

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const Wishlist = useProvideWishlist();
  return (
    <WishlistContext.Provider value={Wishlist}>
      {children}
    </WishlistContext.Provider>
  );
};

const useProvideWishlist = () => {
  const { role } = useAuth();
  const [wishlist, setWishlist] = useState<GetWishlist>({
    data: [],
  });

  const { refetch } = useQuery('wishlist', WishlistService.getWishlist, {
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    enabled: role === 'user' || role === 'admin',
    onSuccess: (data) => {
      setWishlist(data);
    },
  });

  const addWishlistItem = useMutation(
    (variables: { id: string }) => WishlistService.createWishlist(variables.id),
    {
      onSuccess: () => {
        refetch();
        // setWishlist((prev) => [...prev, data.data]);
      },
    }
  );

  const deleteWishlistItem = useMutation(
    (variables: { product_id: string }) =>
      WishlistService.deleteWishlist(variables.product_id),
    {
      onSuccess: () => {
        refetch();
        // setWishlist((prev) => prev.filter((item) => item.id !== variables.id));
      },
    }
  );

  const clearWishlist = useMutation(() => WishlistService.clearWishlist(), {
    onSuccess: () => {
      refetch();
      setWishlist({ data: [] });
    },
  });

  return {
    wishlist,
    setWishlist,
    refetch,
    deleteWishlistItem,
    addWishlistItem,
    clearWishlist,
  };
};
