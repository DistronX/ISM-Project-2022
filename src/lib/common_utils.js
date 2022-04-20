import crypto from 'crypto';
const algorithm = 'aes-256-ctr'; //Using AES encryption


const password = 'abcd1234abcd1234abcd1234abcd1234';
const buffer = Buffer.from(password, 'utf-8');
const iv = Buffer.from("passwordpassword", 'utf-8');

export const encryptText = (text) => {
  const cipher = crypto.createCipheriv(algorithm, buffer, iv);
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};


export const decryptText = (text) => {
  const dicipher = crypto.createDecipheriv(algorithm, password, iv);
  let decrypted = dicipher.update(text, 'hex', 'utf-8');
  decrypted += dicipher.final('utf-8');
  return decrypted;
};