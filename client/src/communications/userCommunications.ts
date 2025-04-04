import axios from 'axios';
import { toast } from 'react-hot-toast';
export const loginUser = async (username: string, password: string) => {

    /**
     * this is the login API call example: 
     * 
     * post: 
http://127.0.0.1:5000/api/v1/user/login
form:
{
    "username": "abcdef",
    "password":"1234"
}

op:
{
    "message": "OK",
    "name": "abcdef"
} */
  try {
    const response = await axios.post('/user/login', { username, password });
    toast.success("Login successful");
    return response.data;
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Login failed");
    throw error;
  }
};

export const signup = async (username: string, name: string, email: string, password: string) => {
  /*  this is the signup API call example:

    post:
http://127.0.0.1:5000/api/v1/user/signup
form:
{
    "username": "abcdef",
    "name":"alla",
    "password":"1234",
    "email":"abcdef@gmail.com"
}



res:
{
    "message": "OK",
    "name": "abcdef"
}
    */
  try {
    console.log(username, name, email, password +" form user comms");
    const response = await axios.post('/user/signup', { username, name, email, password });
    if(response.status === 401 ) {
      toast.error("User already exists");
      return;
    }
    toast.success(response.data.message || "Signup successful");
    return response.data;
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Signup failed");
    throw error;
  }
};

export const logoutUser = async () => {

    /**  
     * 
     * get: http://127.0.0.1:5000/api/v1/user/logout
     * 
     */
  try {
    const response = await axios.get('/user/logout');
    toast.success("Logged out successfully");
    return response.data;
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Logout failed");
    throw error;
  }
};

export const checkAuthStatus = async () => {

    /**
     * 
     * get : http://127.0.0.1:5000/api/v1/user/auth-status
     * 
     * res: {"name": "abcdef"}
     */
  const response = await axios.get('/user/auth-status');
  return response.data;
};


export const fetchDashboardData = async () => {
  try {
    const response = await axios.get('/user/dashboard');
    // console.log(response.data, "dashboard data from user comms")
    return response.data;
  } catch (error) {
    toast.error('Failed to fetch dashboard data');
    throw error;
  }
};
