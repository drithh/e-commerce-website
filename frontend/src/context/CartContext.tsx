import React, { createContext, useContext, useState } from "react";

import { CartService, GetCart, DefaultResponse } from "../api";
import { UseMutationResult, useQuery } from "react-query";
import { useMutation } from "react-query";
import { useAuth } from "./AuthContext";

export type cartType = {
  cart: GetCart;
  setCart?: React.Dispatch<React.SetStateAction<GetCart>>;
  refetch?: () => void;
  addCartItem?: UseMutationResult<
    DefaultResponse,
    unknown,
    {
      product_id: string;
      quantity: number;
      size: string;
    },
    unknown
  >;
  updateCartItem?: UseMutationResult<
    DefaultResponse,
    unknown,
    {
      cart_id: string;
      quantity: number;
    },
    unknown
  >;
  deleteCartItem?: UseMutationResult<
    DefaultResponse,
    unknown,
    {
      cartId: string;
    },
    unknown
  >;
  clearCart?: UseMutationResult<DefaultResponse, unknown, void, unknown>;
};

const CartContext = createContext<cartType>({
  cart: {
    data: [],
  },
});

export const useCart = () => useContext(CartContext);

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const Cart = useProvideCart();
  return <CartContext.Provider value={Cart}>{children}</CartContext.Provider>;
};

const useProvideCart = () => {
  const { role } = useAuth();
  const [cart, setCart] = useState<GetCart>({
    data: [],
  });

  const { refetch } = useQuery("cart", CartService.getCart, {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    enabled: role === "user" || role === "admin",
    onSuccess: (data) => {
      setCart(data);
    },
  });

  const addCartItem = useMutation(
    (variables: { product_id: string; quantity: number; size: string }) =>
      CartService.createCart({ ...variables }),
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  const updateCartItem = useMutation(
    (variables: { cart_id: string; quantity: number }) =>
      CartService.updateCart({ ...variables }),
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  const deleteCartItem = useMutation(
    (variables: { cartId: string }) => CartService.deleteCart(variables.cartId),
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  const clearCart = useMutation(() => CartService.clearCart(), {
    onSuccess: () => {
      refetch();
    },
  });

  return {
    cart,
    setCart,
    refetch,
    addCartItem,
    deleteCartItem,
    updateCartItem,
    clearCart,
  };
};
