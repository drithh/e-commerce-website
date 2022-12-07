import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';

import { capitalCase } from 'change-case';

import { BannerService } from '../../api';
const pluralize = require('pluralize');

const Banners: React.FC = () => {
  const navigate = useNavigate();
  const fetchBanners = useQuery('banners', () => BannerService.getBanners(), {
    staleTime: Infinity,
  });

  return (
    <div className="w-full whitespace-nowrap border border-gray-500 px-8 pt-4 pb-8">
      <div className="flex place-content-end">
        <button
          type="button"
          onClick={() => navigate('create')}
          className="mt-3 mb-6 w-52 border border-gray-500 py-3 px-6 text-center text-xl hover:bg-gray-500 hover:text-gray-100  sm:py-2 sm:text-base"
          aria-label="Create Banner"
        >
          Create Banner
        </button>
      </div>
      <div>
        <div className="flex w-full place-content-evenly  gap-x-4  border-b-2 border-gray-200 pl-4">
          <div className="table-cell flex-1 py-2 text-left font-semibold">
            Title
          </div>
          <div className="table-cell flex-1 py-2 text-left font-semibold">
            Url Path
          </div>
          <div className="table-cell flex-1 py-2 text-left font-semibold">
            Text Position
          </div>
        </div>
      </div>
      <div className="">
        {fetchBanners.data?.data.map((banner) => {
          return (
            <Link key={banner.id} to={`/admin/banners/${banner.id}`}>
              <div
                className=" flex w-full cursor-pointer  place-content-evenly  gap-x-4 border-b-2 border-gray-200 pl-4 hover:bg-gray-50"
                key={banner.id}
              >
                <div className="table-cell flex-1 overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {capitalCase(pluralize.singular(banner.title))}
                </div>
                <div className="table-cell flex-1 overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {banner.url_path}
                </div>
                <div className="table-cell flex-1 overflow-hidden text-ellipsis py-2 text-left font-normal">
                  {banner.text_position}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Banners;
