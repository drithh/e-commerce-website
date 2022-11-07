import { Fragment, useState, FC } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { IoCloseOutline } from 'react-icons/io5';
import ChangePassword from './ChangePassword';
import TopUp from './TopUp';
type Props = {
  buttonText: string;
  refetch?: () => void;
};
const Modal: FC<Props> = ({ buttonText, refetch }) => {
  const [open, setOpen] = useState(false);

  let modalBox: JSX.Element = <></>;

  const closeModal = () => {
    refetch && refetch();
    console.log(refetch);
    setOpen(false);
  };

  if (buttonText === 'Change Password') {
    modalBox = <ChangePassword closeModal={closeModal} />;
  } else if (buttonText === 'Top Up') {
    modalBox = <TopUp closeModal={closeModal} />;
  }
  return (
    <>
      <div>
        <button
          onClick={() => setOpen(true)}
          className=" w-full sm:w-52 py-2 px-4 flex justify-center items-center cursor-pointer hover:bg-gray-500 hover:text-gray-100 border border-gray-300 "
          aria-label={buttonText}
        >
          {buttonText}
        </button>
      </div>
      <Transition show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-[999] overflow-y-auto"
          static
          open={open}
          onClose={() => setOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-[rgba(107,114,128,0.4)]" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="relative my-8 inline-block w-full max-w-md transform overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all">
                <button
                  type="button"
                  className="absolute right-4 top-3 text-4xl outline-none focus:outline-none"
                  onClick={() => setOpen(false)}
                >
                  <IoCloseOutline />
                </button>
                {modalBox}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
