import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "../utils/Axios";
import SummaryApi from "../common/SummaryApis";

const ConfirmDeleteBox = ({
  editData,
  setShowConfirm,
  fetchCategory,
  fetchSubCategory,
  productId,
  fetchProducts,       // ✅ Pass this in where needed
  setdeleteBox
}) => {
  console.log("productid",productId);
  const handleDelete = async () => {
    try {
      // ✅ Delete product first if productId exists
      if (productId) {
        const response = await axiosInstance({
          ...SummaryApi.deleteProduct,
          data: { _id: productId }
        });

        if (response.data?.success) {
          toast.success(response.data.message || "Product deleted successfully");
          fetchProducts();
        } else {
          toast.error(response.data.message || "Failed to delete product");
        }

        setdeleteBox();
        return;
      }

      // ✅ Delete subcategory if editData has category
      if (editData?.category) {
        const response = await axiosInstance({
          ...SummaryApi.deleteSubCategory,
          data: editData,
        });

        if (response.data?.success) {
          toast.success("Subcategory deleted successfully.");
          fetchSubCategory();
        } else {
          toast.error("Failed to delete subcategory.");
        }

        setShowConfirm(false);
        return;
      }

      // ✅ Delete main category
      const response = await axiosInstance({
        ...SummaryApi.deleteCategory,
        data: editData,
      });

      if (response.data?.success) {
        toast.success(response.data.message || "Category deleted successfully.");
        fetchCategory();
      } else {
        toast.error("Failed to delete category.");
      }

      setShowConfirm(false);

    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[300px]">
        <p className="text-gray-800 mb-4">
          Are you sure you want to delete this item?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() => {
              setShowConfirm(false);
              setdeleteBox(false);
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleDelete}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteBox;
