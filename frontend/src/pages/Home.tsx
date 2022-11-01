import Banner from '../components/Banner';
import Card from '../components/Card';
import LinkButton from '../components/button/LinkButton';
import OverlayContainer from '../components/OverlayContainer';
import { HomeService } from '../api';
import { useQuery } from 'react-query';
const pluralize = require('pluralize');

const Home = () => {
  let categories;
  const fetchCategories = useQuery(
    'categories',
    HomeService.getCategoryWithImage,
    {
      staleTime: 1000 * 60,
    }
  );
  const fetchBestSellers = useQuery('bestSellers', HomeService.getBestSeller, {
    staleTime: 1000 * 60,
  });

  if (fetchCategories.isLoading) return <div>Loading...</div>;
  if (fetchCategories.error) return <div>Error</div>;
  if (fetchCategories.data) {
    categories = fetchCategories.data.data.map((category: any) => {
      const title = pluralize.singular(category.title);
      return {
        image: category.image,
        title: `${title.charAt(0).toUpperCase()}${title.slice(1)} Collection`,
      };
    });
  }

  if (fetchBestSellers.isLoading) return <div>Loading...</div>;
  if (fetchBestSellers.error) return <div>Error</div>;

  return (
    <main id="main-content" className="min-h-[60vh]">
      <Banner />

      {/* ===== Category Section ===== */}
      <section className="h-auto w-full border-b-2  border-y-gray-100 py-10  ">
        <div className="my-6 text-center">
          <h2 className="text-3xl">Our Collections</h2>
        </div>
        <div className="wrapper mx-auto max-w-7xl">
          <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories?.map((item: any, index: number) => (
              <div className="relative w-full" key={index}>
                <OverlayContainer imgSrc={item.image} imgAlt={item.title}>
                  <LinkButton
                    href="/product-category/women"
                    extraClass="absolute bottom-[10%] z-20"
                  >
                    {item.title}
                  </LinkButton>
                </OverlayContainer>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Best Selling Section ===== */}
      <section className=" mt-16 mb-20  h-full w-full">
        <div className="wrapper mx-auto flex max-w-7xl flex-col justify-center ">
          <div className="flex justify-center">
            <div className="mb-8 w-3/4 text-center sm:w-1/2 md:w-1/3">
              <h2 className="mb-4 text-3xl">Best Selling</h2>
              <span>
                Here are some of our best selling products. Explore yourself in
                the latest trends.
              </span>
            </div>
          </div>
          <div className="app-x-padding mb-10 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4 lg:gap-x-12">
            {fetchBestSellers.data?.data.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
