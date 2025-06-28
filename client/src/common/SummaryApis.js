

export const baseUrl = 'https://cart-cove-server.vercel.app/';


const SummaryApi = {
    register: {
        url: `${baseUrl}/auth/register`,
        method: 'POST',
    },
    logout: {
        url: `${baseUrl}/auth/logout`,
        method: 'POST',
    },
    addCategory: {
        url: `${baseUrl}/api/add-category`,
        method: 'POST',
    },
    uploadImage: {
        url: `${baseUrl}/file/imageupload`,
        method: 'POST',
    },
    getCategories: {
        url: `${baseUrl}/api/get-category`,
        method: 'GET',
    },
    editCategories: {
        url: `${baseUrl}/api/edit-gategory`,
        method: 'PUT'
    },
    deleteCategory: {
        url: `${baseUrl}/api/delete-category`,
        method: 'DELETE'
    },
    addSubCategory: {
        url: `${baseUrl}/api/add-subcategory`,
        method: 'POST'
    },
    getSubCategoris: ({ page = 1, limit = 10 }) => ({
        url: `${baseUrl}/api/get-subcategories?page=${page}&limit=${limit}`,
        method: "POST",
        withCredentials: true
    }),
    getallSubCategories: {
        url: `${baseUrl}/api/getallsubcategories`,
        method: 'GET'
    },
    editSubCategory: {
        url: `${baseUrl}/api/edit-subcategory`,
        method: 'PUT'
    },
    deleteSubCategory: {
        url: `${baseUrl}/api/delete-subcategory`,
        method: 'DELETE'
    },
    addProduct: {
        url: `${baseUrl}/products/add-product`,
        method: 'POST'
    },
    getProduct: {
        url: `${baseUrl}/products/get-products`,
        method: 'GET'
    },
    updateProduct: {
        url: `${baseUrl}/products/update-product`,
        method: "PUT"
    },
    deleteProduct: {
        url: `${baseUrl}/products/delete-product`,
        method: "DELETE"
    },
    getproductbyCategory: {
        url: `${baseUrl}/products/getproductsbycategory`,
        method: "POST"
    },
    getproductsbycategoryandsubcategory: {
        url: `${baseUrl}/products/getproductsbycategoryandsubcategory`,
        method: "POST"
    },
    getproductbyid: {
        url: `${baseUrl}/products/getproductbyid`,
        method: "POST"
    },
    getproductbysearch: {
        url: `${baseUrl}/products/getproductbysearch`,
        method: "POST"
    },
    addproducttocart: {
        url: `${baseUrl}/products/addtocartproduct`,
        method: "PUT"
    },
    getproductfromcart: {
        url: `${baseUrl}/products/getproductsfromcart`,
        method: "GET"
    },
    updateCartQuantity: {
        url: `${baseUrl}/products/update-cart-quantity`,
        method: "post"
    },
    removeCartQuantity : {
        url : `${baseUrl}/products/removecartitem`,
         method: "POST"
    },
    addaddress: {
        url: `${baseUrl}/address/add`,
        method: "POST"
    },
    getaddress : {
        url: `${baseUrl}/address/get`,
        method: "post"
    },
    updateaddress : {
        url: `${baseUrl}/address/update`,
        method: "PUT"
    },
    placeOrderCOD: {
        url: `${baseUrl}/order/place`,
        method: "POST"
    },
    getorderhistory: {
        url: `${baseUrl}/order/get`,
        method: "POST"
    },

}

export default SummaryApi;

