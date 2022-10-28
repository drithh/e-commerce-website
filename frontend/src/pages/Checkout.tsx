import { useEffect, useState } from 'react';
import axios from 'axios';

import Button from '../components/button/Button';
import { roundDecimal } from '../components/util/utilFunc';
import { useCart } from '../context/cart/CartProvider';
import Input from '../components/input/Input';
import { itemType } from '../context/wishlist/wishlist-type';
import { useAuth } from '../context/AuthContext';

// let w = window.innerWidth;
type PaymentType = 'CASH_ON_DELIVERY' | 'BANK_TRANSFER';
type DeliveryType = 'STORE_PICKUP' | 'YANGON' | 'OTHERS';

type Order = {
  orderNumber: number;
  customerId: number;
  shippingAddress: string;
  township?: null | string;
  city?: null | string;
  state?: null | string;
  zipCode?: null | string;
  orderDate: string;
  paymentType: PaymentType;
  deliveryType: DeliveryType;
  totalPrice: number;
  deliveryDate: string;
};

const ShoppingCart = () => {
  const { cart, clearCart } = useCart();
  const auth = useAuth();
  const [deli, setDeli] = useState<DeliveryType>('STORE_PICKUP');
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentType>('CASH_ON_DELIVERY');

  // Form Fields
  const [name, setName] = useState(auth.user?.fullname || '');
  const [email, setEmail] = useState(auth.user?.email || '');
  const [phone, setPhone] = useState(auth.user?.phone || '');
  const [password, setPassword] = useState('');
  const [diffAddr, setDiffAddr] = useState(false);
  const [address, setAddress] = useState(auth.user?.shippingAddress || '');
  const [shippingAddress, setShippingAddress] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [orderError, setOrderError] = useState('');
  const [sendEmail, setSendEmail] = useState(false);

  const products = cart.map((item) => ({
    id: item.id,
    quantity: item.qty,
  }));

  useEffect(() => {
    if (!isOrdering) return;

    setErrorMsg('');

    // if not logged in, register the user
    const registerUser = async () => {
      const regResponse = await auth.register!(
        email,
        name,
        password,
        address,
        phone
      );
      if (!regResponse.success) {
        setIsOrdering(false);
        if (regResponse.message === 'alreadyExists') {
          setErrorMsg('email_already_exists');
        } else {
          setErrorMsg('error_occurs');
        }
        return false;
      }
    };
    if (!auth.user) registerUser();

    const makeOrder = async () => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders`,
        {
          customerId: auth!.user!.id,
          shippingAddress: shippingAddress ? shippingAddress : address,
          totalPrice: subtotal,
          deliveryDate: new Date().setDate(new Date().getDate() + 7),
          paymentType: paymentMethod,
          deliveryType: deli,
          products,
          sendEmail,
        }
      );
      if (res.data.success) {
        setCompletedOrder(res.data.data);
        clearCart!();
        setIsOrdering(false);
      } else {
        setOrderError('error_occurs');
      }
    };
    if (auth.user) makeOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOrdering, completedOrder, auth.user]);

  useEffect(() => {
    if (auth.user) {
      setName(auth.user.fullname);
      setEmail(auth.user.email);
      setAddress(auth.user.shippingAddress || '');
      setPhone(auth.user.phone || '');
    } else {
      setName('');
      setEmail('');
      setAddress('');
      setPhone('');
    }
  }, [auth.user]);

  let disableOrder = true;

  if (!auth.user) {
    disableOrder =
      name !== '' &&
      email !== '' &&
      phone !== '' &&
      address !== '' &&
      password !== ''
        ? false
        : true;
  } else {
    disableOrder =
      name !== '' && email !== '' && phone !== '' && address !== ''
        ? false
        : true;
  }

  let subtotal: number | string = 0;

  subtotal = roundDecimal(
    cart.reduce(
      (accumulator: number, currentItem: itemType) =>
        accumulator + currentItem.price * currentItem!.qty!,
      0
    )
  );

  let deliFee = 0;
  if (deli === 'YANGON') {
    deliFee = 2.0;
  } else if (deli === 'OTHERS') {
    deliFee = 7.0;
  }

  return (
    <main id="main-content" className="mx-auto mt-24 min-h-[60vh] max-w-7xl">
      {/* ===== Heading & Continue Shopping */}
      <div className="app-max-width w-full border-t-2 border-gray-100 px-4 sm:px-8 md:px-20">
        <h1 className="animatee__animated animate__bounce mt-6 mb-2 text-center text-2xl sm:text-left sm:text-4xl">
          Checkout
        </h1>
      </div>
      {/* ===== Form Section ===== */}
      {!completedOrder ? (
        <div className="app-max-width mb-14 flex flex-col px-4 sm:px-8 md:px-20 lg:flex-row">
          <div className="mr-8 h-full w-full lg:w-7/12">
            {errorMsg !== '' && (
              <span className="text-red text-sm font-semibold">- errorMsg</span>
            )}
            <div className="my-4">
              <label htmlFor="name" className="text-lg">
                Name
              </label>
              <Input
                name="name"
                type="text"
                extraClass="w-full mt-1 mb-2"
                border="border-2 border-gray-400"
                value={name}
                onChange={(e) => setName((e.target as HTMLInputElement).value)}
                required
              />
            </div>

            <div className="my-4">
              <label htmlFor="email" className="mb-1 text-lg">
                Email Address
              </label>
              <Input
                name="email"
                type="email"
                readOnly={auth.user ? true : false}
                extraClass={`w-full mt-1 mb-2 ${
                  auth.user ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                border="border-2 border-gray-400"
                value={email}
                onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
                required
              />
            </div>

            {!auth.user && (
              <div className="my-4">
                <label htmlFor="password" className="text-lg">
                  Password
                </label>
                <Input
                  name="password"
                  type="password"
                  extraClass="w-full mt-1 mb-2"
                  border="border-2 border-gray-400"
                  value={password}
                  onChange={(e) =>
                    setPassword((e.target as HTMLInputElement).value)
                  }
                  required
                />
              </div>
            )}

            <div className="my-4">
              <label htmlFor="phone" className="text-lg">
                Phone
              </label>
              <Input
                name="phone"
                type="text"
                extraClass="w-full mt-1 mb-2"
                border="border-2 border-gray-400"
                value={phone}
                onChange={(e) => setPhone((e.target as HTMLInputElement).value)}
                required
              />
            </div>

            <div className="my-4">
              <label htmlFor="address" className="text-lg">
                Address
              </label>
              <textarea
                aria-label="Address"
                className="mt-1 mb-2 w-full border-2 border-gray-400 p-4 outline-none"
                rows={4}
                value={address}
                onChange={(e) =>
                  setAddress((e.target as HTMLTextAreaElement).value)
                }
              />
            </div>

            <div className="relative mr-2 inline-block w-10 select-none align-middle transition duration-200 ease-in">
              <input
                type="checkbox"
                name="toggle"
                id="toggle"
                checked={diffAddr}
                onChange={() => setDiffAddr(!diffAddr)}
                className="toggle-checkbox absolute block h-6 w-6 cursor-pointer appearance-none rounded-full border-4 border-gray-300 bg-white"
              />
              <label
                htmlFor="toggle"
                className="toggle-label block h-6 cursor-pointer overflow-hidden rounded-full bg-gray-300"
              ></label>
            </div>
            <label htmlFor="toggle" className="text-xs text-gray-700">
              Send to different shipping address
            </label>

            {diffAddr && (
              <div className="my-4">
                <label htmlFor="shipping_address" className="text-lg">
                  {'shipping_address'}
                </label>
                <textarea
                  id="shipping_address"
                  aria-label="shipping address"
                  className="mt-1 mb-2 w-full border-2 border-gray-400 p-4 outline-none"
                  rows={4}
                  value={shippingAddress}
                  onChange={(e) =>
                    setShippingAddress((e.target as HTMLTextAreaElement).value)
                  }
                />
              </div>
            )}
          </div>

          <div className="mt-10 h-full w-full lg:mt-4 lg:w-5/12">
            {/* Cart Totals */}
            <div className="divide-y-2 divide-gray-200 border border-gray-500 p-6">
              <div className="flex justify-between">
                <span className="mb-3 text-base uppercase">Product</span>
                <span className="mb-3 text-base uppercase">SUBTOTAL</span>
              </div>

              <div className="pt-2">
                {cart.map((item) => (
                  <div className="mb-2 flex justify-between" key={item.id}>
                    <span className="text-base font-medium">
                      {item.name}{' '}
                      <span className="text-gray-400">x {item.qty}</span>
                    </span>
                    <span className="text-base">
                      $ {roundDecimal(item.price * item!.qty!)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between py-3">
                <span className="uppercase">SUBTOTAL</span>
                <span>$ {subtotal}</span>
              </div>

              <div className="py-3">
                <span className="uppercase">DELIVERY</span>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between">
                    <div>
                      <input
                        type="radio"
                        name="deli"
                        value="STORE_PICKUP"
                        id="pickup"
                        checked={deli === 'STORE_PICKUP'}
                        onChange={() => setDeli('STORE_PICKUP')}
                      />{' '}
                      <label htmlFor="pickup" className="cursor-pointer">
                        Store Pickup
                      </label>
                    </div>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <input
                        type="radio"
                        name="deli"
                        value="YANGON"
                        id="ygn"
                        checked={deli === 'YANGON'}
                        onChange={() => setDeli('YANGON')}
                        // defaultChecked
                      />{' '}
                      <label htmlFor="ygn" className="cursor-pointer">
                        Within Yangon
                      </label>
                    </div>
                    <span>$ 2.00</span>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <input
                        type="radio"
                        name="deli"
                        value="OTHERS"
                        id="others"
                        checked={deli === 'OTHERS'}
                        onChange={() => setDeli('OTHERS')}
                      />{' '}
                      <label htmlFor="others" className="cursor-pointer">
                        Other Cities
                      </label>
                    </div>
                    <span>$ 7.00</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between py-3">
                  <span>Grand Total</span>
                  <span>$ {roundDecimal(+subtotal + deliFee)}</span>
                </div>

                <div className="mt-2 mb-4 grid gap-4">
                  <label
                    htmlFor="plan-cash"
                    className="relative flex cursor-pointer flex-col rounded-lg border border-gray-300 bg-white p-5 shadow-md"
                  >
                    <span className="text-base font-semibold capitalize leading-tight text-gray-500">
                      Cash On Delivery
                    </span>
                    <input
                      type="radio"
                      name="plan"
                      id="plan-cash"
                      value="CASH_ON_DELIVERY"
                      className="absolute h-0 w-0 appearance-none"
                      onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                    />
                    <span
                      aria-hidden="true"
                      className={`${
                        paymentMethod === 'CASH_ON_DELIVERY'
                          ? 'block'
                          : 'hidden'
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
                  <label
                    htmlFor="plan-bank"
                    className="relative flex cursor-pointer flex-col rounded-lg border border-gray-300 bg-white p-5 shadow-md"
                  >
                    <span className="font-semibold capitalize leading-tight text-gray-500">
                      Bank Transfer
                    </span>
                    <span className="mt-1 text-sm text-gray-400">
                      Make your payment directly into our CB, AYA, Kpay.
                    </span>
                    <input
                      type="radio"
                      name="plan"
                      id="plan-bank"
                      value="BANK_TRANSFER"
                      className="absolute h-0 w-0 appearance-none"
                      onChange={() => setPaymentMethod('BANK_TRANSFER')}
                    />
                    <span
                      aria-hidden="true"
                      className={`${
                        paymentMethod === 'BANK_TRANSFER' ? 'block' : 'hidden'
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
                  <div className="relative mr-2 inline-block w-10 select-none align-middle transition duration-200 ease-in">
                    <input
                      type="checkbox"
                      name="send-email-toggle"
                      id="send-email-toggle"
                      checked={sendEmail}
                      onChange={() => setSendEmail(!sendEmail)}
                      className="toggle-checkbox absolute block h-6 w-6 cursor-pointer appearance-none rounded-full border-4 border-gray-300 bg-white"
                    />
                    <label
                      htmlFor="send-email-toggle"
                      className="toggle-label block h-6 cursor-pointer overflow-hidden rounded-full bg-gray-300"
                    ></label>
                  </div>
                  <label
                    htmlFor="send-email-toggle"
                    className="text-xs text-gray-700"
                  >
                    Send order detail to my email
                  </label>
                </div>
              </div>

              <Button
                value={'Place Order'}
                size="xl"
                extraClass={`w-full`}
                onClick={() => setIsOrdering(true)}
                disabled={disableOrder}
              />
            </div>

            {orderError !== '' && (
              <span className="text-red text-sm font-semibold">
                - {orderError}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="app-max-width mb-14 mt-6 px-4 sm:px-8 md:px-20">
          <div className="text-base text-gray-400">{'thank_you_note'}</div>

          <div className="flex flex-col md:flex-row">
            <div className="mt-2 h-full w-full md:w-1/2 lg:mt-4">
              <div className="divide-y-2 divide-gray-200 border border-gray-500 p-6">
                <div className="flex justify-between">
                  <span className="mb-3 text-base uppercase">{'order_id'}</span>
                  <span className="mb-3 text-base uppercase">
                    {completedOrder.orderNumber}
                  </span>
                </div>

                <div className="pt-2">
                  <div className="mb-2 flex justify-between">
                    <span className="text-base">Email Address</span>
                  </div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-base">Order Date</span>
                    <span className="text-base">
                      {new Date(completedOrder.orderDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mb-2 flex justify-between">
                    <span className="text-base">{'delivery_date'}</span>
                    <span className="text-base">
                      {new Date(
                        completedOrder.deliveryDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="py-3">
                  <div className="mb-2 flex justify-between">
                    <span className="">Payment Method</span>
                    <span>{completedOrder.paymentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="">Delivery Method</span>
                    <span>{completedOrder.deliveryType}</span>
                  </div>
                </div>

                <div className="mb-2 flex justify-between pt-2">
                  <span className="text-base uppercase">Total</span>
                  <span className="text-base">
                    $ {completedOrder.totalPrice}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 h-full w-full md:ml-8 md:mt-2 md:w-1/2 lg:mt-4">
              <div>
                {'your_order_received'}
                {completedOrder.paymentType === 'BANK_TRANSFER' &&
                  'bank_transfer_note'}
                {completedOrder.paymentType === 'CASH_ON_DELIVERY' &&
                  completedOrder.deliveryType !== 'STORE_PICKUP' &&
                  'cash_delivery_note'}
                {completedOrder.deliveryType === 'STORE_PICKUP' &&
                  'store_pickup_note'}
                {'thank_you_for_purchasing'}
              </div>

              {completedOrder.paymentType === 'BANK_TRANSFER' ? (
                <div className="mt-6">
                  <h2 className="text-xl font-bold">{'our_banking_details'}</h2>
                  <span className="my-1 block uppercase">Sat Naing :</span>

                  <div className="flex w-full justify-between xl:w-1/2">
                    <span className="text-sm font-bold">AYA Bank</span>
                    <span className="text-base">20012345678</span>
                  </div>
                  <div className="flex w-full justify-between xl:w-1/2">
                    <span className="text-sm font-bold">CB Bank</span>
                    <span className="text-base">0010123456780959</span>
                  </div>
                  <div className="flex w-full justify-between xl:w-1/2">
                    <span className="text-sm font-bold">KPay</span>
                    <span className="text-base">095096051</span>
                  </div>
                </div>
              ) : (
                <div className="flex h-56 items-center justify-center">
                  <div className="w-3/4">
                    <img
                      className="justify-center"
                      src="/logo.svg"
                      alt="Haru Fashion"
                      width={220}
                      height={50}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ShoppingCart;
