import banner from "../assets/banner.jpg";
import bannermobile from '../assets/banner-mobile.jpg';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import CategoryWiseProduct from "../components/CategoryWiseProduct";

const Home = () => {
  const allCategoris = useSelector((state) => state.product.allCategory);
  const allSubCategories = useSelector((state) => state.product.subCategory);
  const navigate = useNavigate();

  const handleUrlGenerator = (cat) => {
    const subCategory = allSubCategories.find((sub) =>
      sub.category.some((c) => c._id === cat._id)
    );

    if (subCategory) {
      const categoryName = cat.name.replace(/[\s,]+/g, "-");
      const subCategoryName = subCategory.name.replace(/[\s,]+/g, "-");
      const url = `/${categoryName}-${cat._id}/${subCategoryName}-${subCategory._id}`;
      navigate(url);
    }
    return;
  };

  return (
    <section className="bg-white">
      {/* Banner */}
      <div className="w-full mx-auto container">
        <div className={`min-h-48 rounded bg-blue-100 ${!banner ? "animate-pulse" : ""} my-2`}>
          <img
            src={banner}
            className="w-full h-full hidden lg:block"
            alt="banner"
          />
          <img
            src={bannermobile}
            className="w-full h-full lg:hidden"
            alt="banner"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 my-2 grid grid-cols-2 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {allCategoris && allCategoris.length > 0 ? (
          allCategoris.map((category, index) => (
            <div
              key={index}
              onClick={() => handleUrlGenerator(category)}
              className="bg-white rounded p-4 min-h-36 grid gap-2 shadow cursor-pointer"
            >
              <div className="bg-blue-100 min-h-20 rounded flex items-center justify-center overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full object-contain"
                />
              </div>
              <div className="text-center text-sm font-medium">{category.name}</div>
            </div>
          ))
        ) : (
          new Array(20).fill(null).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse"
            >
              <div className="bg-blue-100 min-h-20 rounded"></div>
              <div className="bg-blue-100 h-8 rounded"></div>
            </div>
          ))
        )}
      </div>

      {/* Category-wise Products */}
      <div>
        {allCategoris &&
          allCategoris.map((cate) => (
            <CategoryWiseProduct
              name={cate.name}
              id={cate._id}
              key={cate._id}
            />
          ))}
      </div>
    </section>
  );
};

export default Home;
