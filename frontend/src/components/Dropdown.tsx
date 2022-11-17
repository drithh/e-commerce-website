import { Fragment } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { Menu, Transition } from '@headlessui/react';

interface TypeParams {
  category: Array<string>;
  page: number;
  pageSize: number;
  sortBy: string;
  price: Array<number>;
  condition: string;
  productName: string;
}

interface props {
  params: TypeParams;
  setParams: React.Dispatch<React.SetStateAction<TypeParams>>;
}

const Dropdown = ({ params, setParams }: props) => {
  const sorts = [
    { name: 'Name: A to Z', value: 'Title a_z' },
    { name: 'Name: Z to A', value: 'Title z_a' },
    { name: 'Price: Low to High', value: 'Price a_z' },
    { name: 'Price: High to Low', value: 'Price z_a' },
    { name: 'Newest', value: 'Newest' },
    { name: 'Oldest', value: 'Oldest' },
  ];

  const selectedSort = sorts.find((sort) => sort.value === params.sortBy);

  return (
    <Menu as="div" className="relative inline-block w-full text-left">
      <div>
        <Menu.Button className="inline-flex h-10 w-full justify-between rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700  hover:bg-gray-50  ">
          {selectedSort?.name}
          <HiOutlineChevronDown
            className="-mr-1 ml-2 h-5 w-5"
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
        <Menu.Items className="absolute right-0 z-10 w-[13.5rem] origin-top divide-y rounded bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {sorts.map((sort) => (
            <Menu.Item key={sort.value}>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  onClick={() => {
                    setParams((prev) => ({
                      ...prev,
                      sortBy: sort.value,
                    }));
                  }}
                >
                  {sort.name}
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
