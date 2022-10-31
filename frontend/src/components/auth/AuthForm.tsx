import { Fragment, useState, FC } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { IoCloseOutline } from 'react-icons/io5';
// import { useAuth } from '../../context/AuthContext';
import Button from '../button/Button';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
type CurrentPage = 'login' | 'register' | 'forgot-password';

type Props = {
  extraClass?: string;
  children: any;
};

const LoginForm: FC<Props> = ({ extraClass, children }) => {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('login');
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  let modalBox: JSX.Element;

  if (currentPage === 'login') {
    modalBox = (
      <Login
        onRegister={() => setCurrentPage('register')}
        onForgotPassword={() => setCurrentPage('forgot-password')}
        closeModal={closeModal}
      />
    );
  } else if (currentPage === 'register') {
    modalBox = (
      <Register
        onLogin={() => setCurrentPage('login')}
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
      />
    );
  } else {
    modalBox = (
      <ForgotPassword
        onLogin={() => setCurrentPage('login')}
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
      />
    );
  }

  function closeModal() {
    setOpen(false);
    setErrorMsg('');
  }

  function openModal() {
    setOpen(true);
  }

  return (
    <>
      <div className={`${extraClass}`}>
        <button
          type="button"
          onClick={openModal}
          aria-label="Account"
          className={`${extraClass}`}
        >
          {children}
        </button>
      </div>
      <Transition show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-[999] overflow-y-auto"
          static
          open={open}
          onClose={closeModal}
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
                  onClick={closeModal}
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

export default LoginForm;
