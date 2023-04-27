import { Category } from "../../constants";
import ProductCard from "./ProductCard";

const ProductCategory = ({
  title,
  products,
  currentStatus,
}: {
  title: string;
  products: Category;
  currentStatus: string;
}) => {
  return (
    <section className="productCategoryWrapper">
      <h2 className="categoryTitle">{title}</h2>

      <div className="categoryList">
        {Object.keys(products).map((id, index) => {
          if (products[id].status === currentStatus) return <ProductCard key={index} id={id} />;

          return null;
        })}
      </div>
    </section>
  );
};

export default ProductCategory;
