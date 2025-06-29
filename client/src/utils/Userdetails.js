import axios from 'axios';
import axiosInstance, { baseUrl } from './Axios';


const GetUserDetails = async () => {
try {
    const response = await axios.get(`${baseUrl}/auth/getuserdetails`, {
      withCredentials: true,  // Ensure cookies are sent with the request
    })
    console.log("User Details Response:", response.data);
    return  response.data.user
} catch (error) {
  console.log(error.response.data);  // Check what error is being return
}
}

export default GetUserDetails;