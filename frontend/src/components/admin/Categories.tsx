import { useQuery } from 'react-query';
import { CategoryService } from '../../api';
import { capitalCase } from 'change-case';
import { Link } from 'react-router-dom';
const pluralize = require('pluralize');

const Categories = () => {
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
    <div className="w-full whitespace-nowrap px-8 pt-4 pb-8 border border-gray-500">
      <div className="flex place-content-end">
        <button
          type="button"
          // onClick={() => deleteProduct.mutate(id)}
          className="text-xl mt-3 mb-6 sm:text-base py-3 sm:py-2 px-6 border border-gray-500 w-52 text-center  hover:bg-gray-500 hover:text-gray-100"
          aria-label="Create Category"
        >
          Create Category
        </button>
      </div>
      <div>
        <tr className="border-b-2 flex pl-4  border-gray-200  w-full place-content-evenly gap-x-4">
          <th className="py-2 text-left font-semibold table-cell flex-1">
            Title
          </th>
          <th className="py-2 text-left font-semibold table-cell flex-1">
            Type
          </th>
        </tr>
      </div>
      <div className="">
        {fetchCategories.data?.data.map((category) => {
          return (
            <Link to={`/admin/categories/${category.id}`}>
              <tr
                className=" border-b-2 flex pl-4  border-gray-200  w-full place-content-evenly gap-x-4 hover:bg-gray-50 cursor-pointer"
                key={category.id}
              >
                <td className="py-2 text-left font-normal overflow-hidden text-ellipsis table-cell flex-1">
                  {capitalCase(pluralize.singular(category.title))}
                </td>
                <td className="py-2 text-left font-normal overflow-hidden text-ellipsis table-cell flex-1">
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
