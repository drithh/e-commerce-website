import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import {
  ProductService,
  CategoryService,
  UpdateStock,
  Stock,
  ApiError,
} from "../../api";
import { useState } from "react";
import { HiOutlineChevronLeft } from "react-icons/hi";
import Input from "../input/Input";
import Button from "../button/Button";
import Dropdown from "../input/Dropdown";
import Dropzone from "./Dropzone";
import { convertToBase64 } from "../util/utilFunc";
import { toast } from "react-toastify";

interface categoryType {
  id: string;
  title: string;
}

const Product = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [detail, setDetail] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [stock, setStock] = useState<Stock[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<categoryType[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  // id: string;
  // title: string;
  // brand: string;
  // product_detail: string;
  // images: Array<string>;
  // price: number;
  // category_id: string;
  // condition: string;
  // stock: Array<UpdateStock>;

  const updateProduct = useMutation(
    (variables: {
      title: string;
      brand: string;
      detail: string;
      price: number;
      category: string;
      condition: string;
      stock: UpdateStock[];
      images: string[];
    }) =>
      ProductService.updateProduct({
        id: id as string,
        title: variables.title,
        brand: variables.brand,
        product_detail: variables.detail,
        images: variables.images,
        price: variables.price,
        category_id: variables.category,
        condition: variables.condition,
        stock: variables.stock,
      })
  );

  const fetchProduct = useQuery(
    ["product", id],
    () => ProductService.getProduct(id as string),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setTitle(data.title);
        setBrand(data.brand);
        setDetail(data.product_detail);
        setPrice(data.price);
        setCategory(data.category_name);
        setCondition(data.condition);
        setStock(data.stock as Stock[]);
        setImages(data.images);
      },
    }
  );

  const fetchCategories = useQuery(
    "categories",
    () => CategoryService.getCategory(),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setCategoryOptions(
          data.data.map((category) => ({
            id: category.id,
            title: category.title,
          }))
        );
      },
    }
  );

  if (fetchProduct.isLoading || fetchCategories.isLoading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const base64Images = await Promise.all(
      files.map((file) => convertToBase64(file))
    );

    const combinedImages = [...images, ...base64Images] as string[];

    const selectedCategory = categoryOptions.find(
      (option) => option.title === category
    );

    console.log(combinedImages);
    updateProduct.mutate(
      {
        title,
        brand,
        detail,
        price,
        category: selectedCategory?.id as string,
        condition,
        stock,
        images: combinedImages,
      },
      {
        onSuccess: () => {
          toast.success("Product updated");
        },
        onError: (error) => {
          toast.error((error as ApiError).body.message);
        },
      }
    );
  };

  return (
    <>
      <h2 className="w-full text-2xl font-medium">Update Product</h2>
      <div className="py-3 flex ">
        <Link to="/admin/products" className="flex place-items-center  gap-x-2">
          <HiOutlineChevronLeft className="text-xl" />
          Go Back
        </Link>
      </div>
      <form
        className="information flex w-full flex-col gap-y-4 py-4 text-lg text-gray-700 "
        onSubmit={handleSubmit}
      >
        <div className="">
          <label htmlFor="name" className="text-lg">
            Name
          </label>
          <Input
            name="name"
            type="text"
            extraClass="w-full mt-1 mb-2"
            border="border-2 border-gray-400"
            value={title}
            onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
            required
          />
        </div>
        <div className="">
          <label htmlFor="brand" className="text-lg">
            Brand
          </label>
          <Input
            name="brand"
            type="text"
            extraClass="w-full mt-1 mb-2"
            border="border-2 border-gray-400"
            value={brand}
            onChange={(e) => setBrand((e.target as HTMLInputElement).value)}
            required
          />
        </div>
        <div className="">
          <label htmlFor="address" className="text-lg">
            Product Detail
          </label>
          <textarea
            aria-label="Address"
            className="w-full mt-1 mb-2 border-2 border-gray-400 p-4 outline-none"
            rows={4}
            value={detail}
            onChange={(e) => setDetail((e.target as HTMLTextAreaElement).value)}
            required
          />
          <div className="flex flex-wrap gap-x-4 place-content-between">
            <div className="w-full flex-1 min-w-[10rem]">
              <div className="text-lg mb-1">Price</div>
              <Input
                name="price"
                type="number"
                extraClass="w-full mt-1 mb-2"
                border="border-2 border-gray-400"
                value={price.toString()}
                onChange={(e) =>
                  setPrice(Number((e.target as HTMLInputElement).value))
                }
                required
              />
            </div>
            <div className="">
              <div className="text-lg mb-2">Category Type</div>
              <Dropdown
                selected={category}
                setSelected={setCategory}
                width="w-64"
                border="border-2 border-gray-400"
                options={categoryOptions.map((category) => category.title)}
              />
            </div>
            <div className="">
              <div className="text-lg mb-2">Condition</div>
              <Dropdown
                selected={condition}
                setSelected={setCondition}
                width="w-64"
                border="border-2 border-gray-400"
                options={["new", "used"]}
              />
            </div>
          </div>
          <div className="flex gap-x-4 my-4 flex-wrap">
            {stock.map((item) => (
              <div className="flex-1 min-w-[10rem]" key={item.size}>
                <label htmlFor="stock" className="text-lg">
                  Size {item.size}
                </label>
                <Input
                  name="stock"
                  type="text"
                  extraClass="w-full mt-1 mb-2"
                  border="border-2 border-gray-400"
                  value={item.quantity.toString()}
                  onChange={(e) =>
                    setStock((prev) =>
                      prev.map((stock) =>
                        stock.size === item.size
                          ? {
                              ...stock,
                              quantity: Number(
                                (e.target as HTMLInputElement).value
                              ),
                            }
                          : stock
                      )
                    )
                  }
                  required
                />
              </div>
            ))}
          </div>
        </div>
        <div className=" border-2 border-gray-400 p-4">
          <Dropzone
            initialImages={images}
            setImages={setImages}
            files={files}
            setFiles={setFiles}
          />
        </div>
        <div className="mt-8 flex place-content-end">
          <Button
            type="submit"
            value="Update Product"
            extraClass="w-52 text-center text-xl mb-4"
            size="lg"
          />
        </div>
      </form>
    </>
  );
};

export default Product;