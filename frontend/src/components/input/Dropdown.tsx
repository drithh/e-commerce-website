import { Fragment } from "react";
import { HiOutlineChevronDown } from "react-icons/hi";
import { Menu, Transition } from "@headlessui/react";
import { capitalCase } from "change-case";

interface props {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  options: Array<string>;
  width?: string;
}

const Dropdown = ({ selected, setSelected, options, width }: props) => {
  const selectedSort = options.find((option) => option === selected);

  return (
    <Menu as="div" className={`relative inline-block text-left ${width}`}>
      <div>
        <Menu.Button className="inline-flex h-12 w-full justify-between p-4 border-2 border-gray-500 bg-white px-4 py-2 text font-medium text-gray-700  hover:bg-gray-50">
          {capitalCase(selectedSort || "")}
          <HiOutlineChevronDown
            className="-mr-1 ml-2 h-8 w-5"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`absolute right-0 z-10 origin-top divide-y rounded bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${width}`}
        >
          {options.map((option) => (
            <Menu.Item key={option}>
              {({ active }) => (
                <button
                  type="button"
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } group flex w-full items-center rounded-md px-2 py-2 text`}
                  onClick={() => {
                    setSelected(option);
                  }}
                >
                  {capitalCase(option)}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Dropdown;
