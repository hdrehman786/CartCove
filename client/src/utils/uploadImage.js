import SummaryApi from '../common/SummaryApis.js';
import axiosInstance from './Axios.js';

const uploadImage = async (image)=>{
        try {
            const formData = new FormData();
            formData.append('image', image);
            const response = await axiosInstance({
                ...SummaryApi.uploadImage,
                data: formData
            })
            return response.data;
        } catch (error) {
        return error
        }
}

export default uploadImage;