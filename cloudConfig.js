const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config(
    {
        cloud_name:process.env.CLOUD,
        api_key:process.env.API_KEY,
        api_secret: process.env.API_SECRET

    }
);

 
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowed_formats: ["png","jpeg","jpg"] ,// supports promises as well
      
    },
  });
   
module.exports = {cloudinary,storage};