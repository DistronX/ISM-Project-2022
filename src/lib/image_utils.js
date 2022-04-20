import path from 'path';
import axios from 'axios';
import { exit } from 'process';


const ENCRYPTION_BASE_URL = 'http://172.20.10.3:5000/encryption';
const DECRYPTION_BASE_URL = 'http://172.20.10.3:5000/decryption';


export const encryptImage = async (image_path) => {
  const response = await axios.post(ENCRYPTION_BASE_URL, {path: image_path});
  return response.data;
}


export const decryptImage = async (image_path, mask, shape) => {
  const response = await axios.post(DECRYPTION_BASE_URL, {encrypted_image: image_path, mask: mask, shape: shape});
  return response.data;
}