import { Fragment, useRef, useState, useEffect } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { HiOutlineChevronDown } from 'react-icons/hi';

interface props {
  menuTitle: string;
  linksArray: Array<Array<string>>;
}

const PopoverMenu = ({ menuTitle, linksArray }: props) => {
  let timeout: NodeJS.Timeout;
  const timeoutDuration = 100;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [openState, setOpenState] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setOpenState((openState) => !openState);
    buttonRef?.current?.click();
  };

  const onHover = (open: boolean, action: string) => {
    if (
      (!open && !openState && action === 'onMouseEnter') ||
      (open && openState && action === 'onMouseLeave')
    ) {
      clearTimeout(timeout);
      timeout = setTimeout(() => toggleMenu(), timeoutDuration);
    }
  };

  const handleClick = (open: boolean) => {
    setOpenState(!open);
    clearTimeout(timeout);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      event.stopPropagation();
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  // get button width
  const buttonWidth = menuRef?.current?.offsetWidth;
  return (
    <Popover className="">
      {({ open }) => (
        <div
          onMouseEnter={() => onHover(open, 'onMouseEnter')}
          onMouseLeave={() => onHover(open, 'onMouseLeave')}
          className="flex flex-col"
        >
          <Popover.Button ref={buttonRef}>
            <div
              className={`${
                open ? 'text-black' : 'text-gray-700'
              } flex justify-center px-1 pb-2 text-gray-700 min-w-[8rem] w-max transition duration-500 ease-in-out hover:ring-0 hover:outline-0 border-0 outline-0 hover:text-black focus:outline-0 place-items-center gap-x-2 flex-row
              `}
              ref={menuRef}
              onClick={() => handleClick(open)}
            >
              <div>{menuTitle}</div>
              <HiOutlineChevronDown
                className={`${
                  open ? 'text-black translate-y-[0.15rem]' : 'text-gray-500'
                } text-[1.5rem] inline-block transform transition-all duration-500 opacity-70
                `}
                aria-hidden="true"
              />
            </div>
          </Popover.Button>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel static className="z-10  mx-auto">
              <div
                className="relative grid space-y-[2px] bg-white border border-gray-100 border-t-0 text-center shadow-md"
                style={{ width: buttonWidth }}
              >
                {linksArray.map(([title, href]) => (
                  <Fragment key={'PopoverPanel<>' + title + href}>
                    <a
                      href={href}
                      className="py-2 px-1  text-gray-400 transition duration-500 ease-in-out bg-white hover:text-black"
                    >
                      {title}
                    </a>
                  </Fragment>
                ))}
              </div>
            </Popover.Panel>
          </Transition>
        </div>
      )}
    </Popover>
  );
};

export default PopoverMenu;
