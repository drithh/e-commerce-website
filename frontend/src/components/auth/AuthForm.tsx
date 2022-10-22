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
  // const auth = useAuth();
  let auth = { user: null, login: null, logout: null };
  const [currentPage, setCurrentPage] = useState<CurrentPage>('login');
  const [open, setOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  let modalBox: JSX.Element;
  if (auth.user) {
    modalBox = (
      <SuccessModal successMsg={successMsg} setSuccessMsg={setSuccessMsg} />
    );
  } else {
    if (currentPage === 'login') {
      modalBox = (
        <Login
          onRegister={() => setCurrentPage('register')}
          onForgotPassword={() => setCurrentPage('forgot-password')}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
          setSuccessMsg={setSuccessMsg}
        />
      );
    } else if (currentPage === 'register') {
      modalBox = (
        <Register
          onLogin={() => setCurrentPage('login')}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
          setSuccessMsg={setSuccessMsg}
        />
      );
    } else {
      modalBox = (
        <ForgotPassword
          onLogin={() => setCurrentPage('login')}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
          setSuccessMsg={setSuccessMsg}
        />
      );
    }
  }

  function closeModal() {
    setOpen(false);
    setErrorMsg('');
    setTimeout(() => {
      setSuccessMsg('profile');
    }, 100);
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
              <div className="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl">
                <button
                  type="button"
                  className="absolute right-4 top-3 outline-none focus:outline-none text-4xl"
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

const SuccessModal = ({
  successMsg,
  setSuccessMsg,
}: {
  successMsg: string;
  setSuccessMsg: React.Dispatch<React.SetStateAction<string>>;
}) => {
  // const auth = useAuth();
  let auth: any;

  const handleLogout = () => {
    auth.logout!();
    setSuccessMsg('');
  };
  return (
    <>
      <Dialog.Title
        as="h3"
        className="text-xl md:text-2xl whitespace-nowrap text-center my-8 font-medium leading-6 text-gray-900"
      >
        {/* {("login_successful")} */}
        {/* {("register_successful")} */}
        {successMsg !== '' ? successMsg : 'profile'}
      </Dialog.Title>
      <div className="mb-12">
        <div>
          {'Name '} - {auth.user?.fullname}
        </div>
        <div>
          {'Email Adress'} - {auth.user?.email}
        </div>
        <div>
          {'Phone '} - {auth.user?.phone && auth.user?.phone}
        </div>
      </div>
      <div className="flex justify-center items-center">
        <Button value={'Logout'} onClick={handleLogout} />
      </div>
    </>
  );
};

export default LoginForm;
