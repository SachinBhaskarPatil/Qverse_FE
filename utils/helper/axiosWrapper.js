
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.qverse.life/api/generator',
  headers: {
    'Content-Type': 'application/json',
  },
});

const get = async (url, config = {}) => {
  try {
    const response = await axiosInstance.get(url, config);
    return response.data; 
  } catch (error) {
    handleError(error);
  }
};

const post = async (url, data, config = {}) => {
  try {
    const response = await axiosInstance.post(url, data, config);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const put = async (url, data, config = {}) => {
  try {
    const response = await axiosInstance.put(url, data, config);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const del = async (url, config = {}) => {
  try {
    const response = await axiosInstance.delete(url, config);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const handleError = (error) => {
  if (error.response) {
    console.error('Error response:', error.response);
  } else if (error.request) {
    console.error('Error request:', error.request); 
  } else {
    console.error('Error message:', error.message);
  }
  return null; 
};

export default { get, post, put, del };
