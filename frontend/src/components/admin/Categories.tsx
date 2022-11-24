import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';

import { capitalCase } from 'change-case';

import { CategoryService } from '../../api';
const pluralize = require('pluralize');

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const fetchCategories = useQuery(
    'categories',
    () => CategoryService.getCategory(),
    {
      staleTime: Infinity,
    }
  );

  if (fetchCategories.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full whitespace-nowrap border border-gray-500 px-8 pt-4 pb-8">
      <div className="flex place-content-end">
        <button
          type="button"
          onClick={() => navigate('create')}
          className="mt-3 mb-6 w-52 border border-gray-500 py-3 px-6 text-center text-xl hover:bg-gray-500 hover:text-gray-100  sm:py-2 sm:text-base"
          aria-label="Create Category"
        >
          Create Category
        </button>
      </div>
      <div>
        <tr className="flex w-full place-content-evenly  gap-x-4  border-b-2 border-gray-200 pl-4">
          <th className="table-cell flex-1 py-2 text-left font-semibold">
            Title
          </th>
          <th className="table-cell flex-1 py-2 text-left font-semibold">
            Type
          </th>
        </tr>
      </div>
      <div className="">
        {fetchCategories.data?.data.map((category) => {
          return (
            <Link key={category.id} to={`/admin/categories/${category.id}`}>
              <tr
                className=" flex w-full cursor-pointer  place-content-evenly  gap-x-4 border-b-2 border-gray-200 pl-4 hover:bg-gray-50"
                key={category.id}
              >
                <td className="table-cell flex-1 overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {capitalCase(pluralize.singular(category.title))}
                </td>
                <td className="table-cell flex-1 overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {capitalCase(pluralize.singular(category.type), {
                    delimiter: ' & ',
                  })}
                </td>
              </tr>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
