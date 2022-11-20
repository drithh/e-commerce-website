import { useState } from 'react';
import { HiOutlineChevronLeft } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { ApiError, CategoryService } from '../../api';
import Button from '../button/Button';
import Input from '../input/Input';
import { toast } from 'react-toastify';
import Dropdown from '../input/Dropdown';
import { useNavigate } from 'react-router-dom';

const categoryTypes = ['tops', 'bottoms', 'shoes & accessories'];

const CreateCategory = () => {
  const [category, setCategory] = useState('');
  const [categoryType, setCategoryType] = useState('tops');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createCategory = useMutation(
    (variables: { title: string; type: string }) =>
      CategoryService.createCategory({
        title: variables.title,
        type: variables.type,
      }),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries('categories');
        navigate('/admin/categories');
      },
      onError: (error) => {
        toast.error((error as ApiError).body.message);
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createCategory.mutate({ title: category, type: categoryType });
  };

  return (
    <>
      <h2 className="w-full text-2xl font-medium">Create Category</h2>
      <div className="py-3 flex ">
        <Link
          to="/admin/categories"
          className="flex place-items-center  gap-x-2"
        >
          <HiOutlineChevronLeft className="text-xl" />
          Go Back
        </Link>
      </div>
      <form
        className="information flex w-full flex-col gap-y-4 py-4 text-lg text-gray-700 min-h-[32rem]"
        onSubmit={handleSubmit}
      >
        <div className="">
          <label htmlFor="categoryTitle" className="text-lg">
            Category Title
          </label>
          <Input
            name="categoryTitle"
            type="text"
            extraClass="w-full mt-1 mb-2"
            border="border-2 border-gray-400"
            value={category}
            onChange={(e) => setCategory((e.target as HTMLInputElement).value)}
            required
          />
        </div>
        <div className="">
          <div className="text-lg mb-2">Category Type</div>
          <Dropdown
            selected={categoryType}
            setSelected={setCategoryType}
            width="w-64"
            options={categoryTypes}
          />
        </div>
        <div className="mt-8 flex place-content-between">
          <button
            type="button"
            onClick={() => navigate('/admin/categories')}
            className="text-xl sm:text-base py-3 sm:py-2 px-6 border border-gray-500 w-52 text-center  mb-4 hover:bg-gray-500 hover:text-gray-100"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <Button
            type="submit"
            value="Create Category"
            extraClass="w-52 text-center text-xl mb-4"
            size="lg"
          />
        </div>
      </form>
    </>
  );
};

export default CreateCategory;
