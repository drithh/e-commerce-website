// import { Fragment, useState, FC } from 'react';
// import { Dialog, Transition } from '@headlessui/react';
// import { IoCloseOutline } from 'react-icons/io5';
// import { useCart } from '../context/CartContext';
// import { app__schemas__wishlist__GetProduct } from '../api';
// import Input from './input/Input';
// import Button from './button/Button';

// interface Props {
//   item: app__schemas__wishlist__GetProduct;
// }

// const AddToCart: FC<Props> = ({ item }) => {
//   const { addCartItem } = useCart();
//   const [open, setOpen] = useState(false);
//   const [errorMsg, setErrorMsg] = useState('');
//   // const closeModal = () => {
//   //   refetch && refetch();
//   //   setOpen(false);
//   // };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//   };

//   return (
//     <>
//       <div>
//         <button
//           onClick={() => setOpen(true)}
//           className="text-xl sm:text-base w-40 border border-gray-500 bg-gray-500 text-gray-100 hover:text-gray-300"
//           aria-label="Add to cart"
//         >
//           Add to Cart
//         </button>
//       </div>
//       <Transition show={open} as={Fragment}>
//         <Dialog
//           as="div"
//           className="fixed inset-0 z-[999] overflow-y-auto"
//           static
//           open={open}
//           onClose={() => setOpen(false)}
//         >
//           <div className="min-h-screen px-4 text-center">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0"
//               enterTo="opacity-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100"
//               leaveTo="opacity-0"
//             >
//               <Dialog.Overlay className="fixed inset-0 bg-[rgba(107,114,128,0.4)]" />
//             </Transition.Child>

//             {/* This element is to trick the browser into centering the modal contents. */}
//             <span
//               className="inline-block h-screen align-middle"
//               aria-hidden="true"
//             >
//               &#8203;
//             </span>
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <div className="relative my-8 inline-block w-full max-w-md transform overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all">
//                 <button
//                   type="button"
//                   className="absolute right-4 top-3 text-4xl outline-none focus:outline-none"
//                   onClick={() => setOpen(false)}
//                 >
//                   <IoCloseOutline />
//                 </button>
//                 <Dialog.Title
//                   as="h3"
//                   className="my-8 text-center text-4xl font-medium leading-6 text-gray-800"
//                 >
//                   Pick a size
//                 </Dialog.Title>
//                 <form onSubmit={handleSubmit} className="mt-2">
//                   {/* <Input
//                     type="password"
//                     placeholder={'Current Password *'}
//                     name="password"
//                     required
//                     extraClass={`w-full focus:border-gray-500 mb-4 ${
//                       errorMsg ? 'border-red-300' : ''
//                     }`}
//                     border="border-2 border-gray-300 mb-4"
//                     onChange={(e) =>
//                       setCurrentPassword((e.target as HTMLInputElement).value)
//                     }
//                     value={currentPassword}
//                   />
//                   <Input
//                     type="password"
//                     placeholder={'New Password *'}
//                     name="password"
//                     required
//                     extraClass={`w-full focus:border-gray-500 mb-4 ${
//                       errorMsg ? 'border-red-300' : ''
//                     }`}
//                     border="border-2 border-gray-300"
//                     onChange={(e) =>
//                       setNewPassword((e.target as HTMLInputElement).value)
//                     }
//                     value={newPassword}
//                   /> */}
//                   <div className="sizeContainer mb-4 flex space-x-4 text-sm">
//                     {fetchProduct
//                       .data!.size?.map((singleSize) => ({
//                         singleSize,
//                         points:
//                           singleSize === 'M'
//                             ? 0
//                             : singleSize.length *
//                               (singleSize.includes('S') ? -1 : 1),
//                       }))
//                       .sort((a, b) => a.points - b.points)
//                       .map(({ singleSize }) => (
//                         <button
//                           key={singleSize}
//                           className={`${
//                             size === singleSize
//                               ? 'border-gray-500'
//                               : 'border-gray-300 text-gray-400'
//                           } flex h-8 w-8 items-center justify-center border hover:bg-gray-500 hover:text-gray-100`}
//                           onClick={() => setSize(singleSize)}
//                         >
//                           {singleSize}
//                         </button>
//                       ))}
//                   </div>
//                   {errorMsg !== '' && (
//                     <div className="mb-4 whitespace-nowrap text-sm text-red-600">
//                       {errorMsg}
//                     </div>
//                   )}

//                   <Button
//                     type="submit"
//                     value="Add to Cart"
//                     extraClass="w-full text-center text-xl mb-4"
//                     size="lg"
//                   />
//                 </form>
//               </div>
//             </Transition.Child>
//           </div>
//         </Dialog>
//       </Transition>
//     </>
//   );
// };

// export default AddToCart;
export {};
