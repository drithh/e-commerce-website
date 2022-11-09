import { useEffect, useState } from "react";

import Button from "../components/button/Button";
import { roundDecimal } from "../components/util/utilFunc";
import Input from "../components/input/Input";
import { useCart } from "../context/CartContext";
import { UserService, OrderService, ApiError } from "../api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type PaymentType = "BALANCE";
type DeliveryType = "REGULAR" | "NEXT_DAY";

const ShoppingCart = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [addressName, setAddressName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentType>("BALANCE");
  const [delivery, setDelivery] = useState<DeliveryType>("REGULAR");

  const [useUserAddress, setUseUserAddress] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);

  const fetchUserAddress = useQuery("userAddress", () =>
    UserService.getUserShippingAddress()
  );

  const fetchOrder = useQuery("order", () => OrderService.getOrdersUser(), {
    enabled: false,
  });

  const createOrder = useMutation(OrderService.createOrder, {
    onSuccess: (data) => {
      toast.success(data.message);
      fetchOrder.refetch();
      queryClient.invalidateQueries("cart");
      queryClient.invalidateQueries("user");

      navigate("/profile/order");
    },
    onError: (error) => {
      toast.error((error as ApiError).body.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createOrder.mutate({
      shipping_method: delivery === "REGULAR" ? "Regular" : "Next Day",
      shipping_address: {
        address_name: addressName,
        phone_number: phoneNumber,
        address: address,
        city: city,
      },
    });
  };

  useEffect(() => {
    if (useUserAddress && fetchUserAddress.data) {
      setAddressName(fetchUserAddress.data.address_name);
      setPhoneNumber(fetchUserAddress.data.phone_number);
      setAddress(fetchUserAddress.data.address);
      setCity(fetchUserAddress.data.city);
    }
  }, [useUserAddress, fetchUserAddress.data]);

  if (fetchUserAddress.isLoading) {
    return <div>Loading...</div>;
  }

  const subtotal = roundDecimal(
    cart.data.reduce((acc, item) => {
      return acc + item.details.quantity * item.price;
    }, 0)
  );

  //  Regular:
  //  If total price of items < 200k: Shipping price is 15% of the total price of items purchased
  //  If total price of items >= 200k: Shipping price is 20% of the total price of items purchased
  const regularDelivery = subtotal < 200000 ? subtotal * 0.15 : subtotal * 0.2;

  //  Next Day:
  //  If total price of items < 300k: Shipping price is 20% of the total price of items purchased
  //  If total price of items >= 300k: Shipping price is 25% of the total price of items purchased
  const nextDayDelivery = subtotal < 300000 ? subtotal * 0.2 : subtotal * 0.25;

  return (
    <main id="main-content" className="mx-auto mt-24 min-h-[60vh] max-w-7xl">
      {/* ===== Heading & Continue Shopping */}
      <div className="app-max-width w-full border-t-2 border-gray-100 px-4 sm:px-8 md:px-20">
        <h1 className="animatee__animated animate__bounce mt-6 mb-2 text-center text-2xl sm:text-left sm:text-4xl">
          Checkout
        </h1>
      </div>
      {/* ===== Form Section ===== */}
      <form
        className="app-max-width mb-14 flex flex-col px-4 sm:px-8 md:px-20 lg:flex-row"
        onSubmit={handleSubmit}
      >
        <section className="mr-8 h-full w-full lg:w-7/12">
          <div className="my-4">
            <label htmlFor="addressName" className="text-lg">
              Addres Name
            </label>
            <Input
              name="addressName"
              type="text"
              extraClass={`${
                useUserAddress ? "bg-gray-100" : ""
              } w-full mt-1 mb-2`}
              border="border-2 border-gray-400"
              value={addressName}
              onChange={(e) =>
                setAddressName((e.target as HTMLInputElement).value)
              }
              readOnly={useUserAddress}
              required
            />
          </div>

          <div className="my-4">
            <label htmlFor="phoneNumber" className="mb-1 text-lg">
              Phone Number
            </label>
            <Input
              name="phoneNumber"
              type="email"
              extraClass={`${
                useUserAddress ? "bg-gray-100" : ""
              } w-full mt-1 mb-2`}
              border="border-2 border-gray-400"
              value={phoneNumber}
              onChange={(e) =>
                setPhoneNumber((e.target as HTMLInputElement).value)
              }
              readOnly={useUserAddress}
              required
            />
          </div>

          <div className="my-4">
            <label htmlFor="address" className="text-lg">
              Address
            </label>
            <Input
              name="address"
              type="text"
              extraClass={`${
                useUserAddress ? "bg-gray-100" : ""
              } w-full mt-1 mb-2`}
              border="border-2 border-gray-400"
              value={address}
              onChange={(e) => setAddress((e.target as HTMLInputElement).value)}
              readOnly={useUserAddress}
              required
            />
          </div>

          <div className="my-4">
            <label htmlFor="city" className="text-lg">
              City
            </label>
            <Input
              name="city"
              type="text"
              extraClass={`${
                useUserAddress ? "bg-gray-100" : ""
              } w-full mt-1 mb-2`}
              border="border-2 border-gray-400"
              value={city}
              onChange={(e) => setCity((e.target as HTMLInputElement).value)}
              readOnly={useUserAddress}
              required
            />
          </div>
          <button
            type="button"
            className=" flex place-items-center"
            onClick={() => setUseUserAddress(!useUserAddress)}
          >
            <div className="relative mr-2 inline-block w-10 select-none align-middle transition duration-200 ease-in">
              <input
                type="checkbox"
                name="toggle-user-address"
                id="toggle-user-address"
                checked={useUserAddress}
                onChange={() => setUseUserAddress(!useUserAddress)}
                className={`${
                  useUserAddress ? "right-0 border-gray-500" : "border-gray-300"
                } absolute block h-6 w-6 cursor-pointer appearance-none rounded-full border-4  bg-white`}
              />
              <label
                htmlFor="toggle"
                className={`${
                  useUserAddress ? " bg-gray-500" : "bg-gray-300"
                }  block h-6 cursor-pointer overflow-hidden rounded-full `}
              ></label>
            </div>
            <label htmlFor="toggle-user-address">
              Use my address as shipping address
            </label>
          </button>
        </section>
        {/* Cart Totals */}
        <section className="mt-10 h-full w-full lg:mt-4 lg:w-5/12">
          <div className="divide-y-2 divide-gray-200 border border-gray-500 p-6">
            <div className="flex justify-between">
              <span className="mb-3 text-base uppercase">Product</span>
              <span className="mb-3 text-base uppercase">SUBTOTAL</span>
            </div>

            <div className="pt-2">
              {cart.data.map((item) => (
                <div className="mb-2 flex justify-between" key={item.id}>
                  <div className="  flex">
                    <span className="text-base font-medium max-w-[10rem] text-ellipsis overflow-clip whitespace-pre">
                      {item.name}{" "}
                    </span>
                    <span className="text-gray-400">
                      {" "}
                      ({item.details.size}) x {item.details.quantity}
                    </span>
                  </div>
                  <div className="text-base">
                    Rp {roundDecimal(item.price * item!.details.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between py-3">
              <span className="uppercase">SUBTOTAL</span>
              <span>Rp {subtotal}</span>
            </div>

            <div className="py-3">
              <span className="uppercase">DELIVERY</span>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between">
                  <div>
                    <input
                      type="radio"
                      name="delivery"
                      value="REGULAR"
                      id="regular"
                      checked={delivery === "REGULAR"}
                      onChange={() => setDelivery("REGULAR")}
                    />{" "}
                    <label htmlFor="regular" className="cursor-pointer">
                      Regular
                    </label>
                  </div>
                  <span>Rp {regularDelivery}</span>
                </div>
                <div className="flex justify-between">
                  <div>
                    <input
                      type="radio"
                      name="delivery"
                      value="NEXT_DAY"
                      id="next_day"
                      checked={delivery === "NEXT_DAY"}
                      onChange={() => setDelivery("NEXT_DAY")}
                    />{" "}
                    <label htmlFor="next_day" className="cursor-pointer">
                      Next Day
                    </label>
                  </div>
                  <span>Rp {nextDayDelivery}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between py-3">
                <span>Grand Total</span>
                <span>
                  Rp{" "}
                  {roundDecimal(
                    +subtotal +
                      (delivery === "REGULAR"
                        ? regularDelivery
                        : nextDayDelivery)
                  )}
                </span>
              </div>

              <div className="mt-2 mb-4 grid gap-4">
                <label
                  htmlFor="plan-bank"
                  className="relative flex cursor-pointer flex-col rounded-lg border border-gray-300 bg-white p-5 shadow-md"
                >
                  <span className="font-semibold capitalize leading-tight text-gray-500">
                    Balance
                  </span>
                  <span className="mt-1 text-sm text-gray-400">
                    Pay with your balance
                  </span>
                  <input
                    type="radio"
                    name="plan"
                    id="plan-bank"
                    value="BALANCE"
                    className="absolute h-0 w-0 appearance-none"
                    onChange={() => setPaymentMethod("BALANCE")}
                  />
                  <span
                    aria-hidden="true"
                    className={`${
                      paymentMethod === "BALANCE" ? "block" : "hidden"
                    } absolute inset-0 rounded-lg border-2 border-gray-500 bg-opacity-10`}
                  >
                    <span className="absolute top-4 right-4 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5 text-green-600"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </span>
                </label>
              </div>

              <div className="my-8">
                <button
                  type="button"
                  className=" flex place-items-center"
                  onClick={() => setSendEmail(!sendEmail)}
                >
                  <div className="relative mr-2 inline-block w-10 select-none align-middle transition duration-200 ease-in">
                    <input
                      type="checkbox"
                      name="toggle-user-email"
                      id="toggle-user-email"
                      checked={sendEmail}
                      onChange={() => setSendEmail(!sendEmail)}
                      className={`${
                        sendEmail
                          ? "right-0 border-gray-500"
                          : "border-gray-300"
                      } absolute block h-6 w-6 cursor-pointer appearance-none rounded-full border-4  bg-white`}
                    />
                    <label
                      htmlFor="toggle"
                      className={`${
                        sendEmail ? " bg-gray-500" : "bg-gray-300"
                      }  block h-6 cursor-pointer overflow-hidden rounded-full `}
                    ></label>
                  </div>
                  <label htmlFor="toggle-user-email">
                    Send order detail to my email
                  </label>
                </button>
              </div>
            </div>

            <Button
              value="Place Order"
              size="xl"
              extraClass={`w-full`}
              type="submit"
            />
          </div>
        </section>
      </form>
    </main>
  );
};

export default ShoppingCart;
