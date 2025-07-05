import axios from 'axios';
import axiosInstance, { baseUrl } from './Axios';


const GetUserDetails = async () => {
try {
    const response = await axios.get(`${baseUrl}/auth/getuserdetails`, {
      withCredentials: true,
    })
    return  response.data.user
} catch (error) {
  console.log(error.response.data);  
}
}

export default GetUserDetails;