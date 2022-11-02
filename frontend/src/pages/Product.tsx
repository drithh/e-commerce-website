import Card from '../components/Card';
import Pagination from '../components/Pagination';
import DownArrow from '../assets/icons/DownArrow';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ProductService } from '../api';

const Product: React.FC = () => {
  const fetchProducts = useQuery(
    'products',
    () => ProductService.getProducts(),
    {
      staleTime: Infinity,
    }
  );
  if (fetchProducts.isLoading) {
    return <div>Loading...</div>;
  }
  if (fetchProducts.isError) {
    return <div>Error...</div>;
  }

  return (
    <main id="main-content" className="mx-auto mt-20 min-h-[60vh] max-w-7xl">
      {/* ===== Heading & Continue Shopping */}
      <div className="w-full border-t-2 border-gray-100 ">
        <h1 className="animatee__animated animate__bounce mt-6 mb-2 text-center text-2xl sm:text-left sm:text-4xl">
          Product
        </h1>
      </div>

      {/* ===== Product Section ===== */}
      <div className="flex gap-x-4 min-h-screen">
        <section className="border-r-gray-100 border-r w-60">a</section>
        <section className="grid grid-cols-4 gap-4">
          {fetchProducts.data?.data.map((product) => (
            <Card key={product.id} item={product} />
          ))}
        </section>
      </div>
    </main>
  );
};

// const SortMenu: React.FC<{ orderby: OrderType }> = ({ orderby }) => {
//   // const { category } = router.query;

//   let currentOrder: string;

//   if (orderby === 'price') {
//     currentOrder = 'sort_by_price';
//   } else if (orderby === 'price-desc') {
//     currentOrder = 'sort_by_price_desc';
//   } else {
//     currentOrder = 'sort_by_latest';
//   }
//   return (
//     <Menu as="div" className="relative">
//       <Menu.Button as="a" href="#" className="flex items-center capitalize">
//         currentOrder <DownArrow />
//       </Menu.Button>
//       <Menu.Items className="flex flex-col z-10 items-start text-xs sm:text-sm w-auto sm:right-0 absolute p-1 border border-gray200 bg-white mt-2 outline-none">
//         <Menu.Item>
//           {({ active }) => (
//             <button
//               type="button"
//               onClick={
//                 () => {}
//                 // router.push(`/product-category/${category}?orderby=latest`)
//               }
//               className={`${
//                 active ? 'bg-gray100 text-gray500' : 'bg-white'
//               } py-2 px-4 text-left w-full focus:outline-none whitespace-nowrap ${
//                 currentOrder === 'sort_by_latest' && 'bg-gray500 text-gray100'
//               }`}
//             >
//               Sort by latest
//             </button>
//           )}
//         </Menu.Item>
//         <Menu.Item>
//           {({ active }) => (
//             <button
//               type="button"
//               onClick={
//                 () => {}
//                 // router.push(`/product-category/${category}?orderby=price`)
//               }
//               className={`${
//                 active ? 'bg-gray100 text-gray500' : 'bg-white'
//               } py-2 px-4 text-left w-full focus:outline-none whitespace-nowrap ${
//                 currentOrder === 'sort_by_price' && 'bg-gray500 text-gray100'
//               }`}
//             >
//               Sort by price
//             </button>
//           )}
//         </Menu.Item>
//         <Menu.Item>
//           {({ active }) => (
//             <button
//               type="button"
//               onClick={
//                 () => {}
//                 // router.push(`/product-category/${category}?orderby=price-desc`)
//               }
//               className={`${
//                 active ? 'bg-gray100 text-gray500' : 'bg-white'
//               } py-2 px-4 text-left w-full focus:outline-none whitespace-nowrap ${
//                 currentOrder === 'sort_by_price_desc' &&
//                 'bg-gray500 text-gray100'
//               }`}
//             >
//               Sort by price desc
//             </button>
//           )}
//         </Menu.Item>
//       </Menu.Items>
//     </Menu>
//   );
// };

export default Product;
