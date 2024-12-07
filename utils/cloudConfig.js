const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME ||"krishorg" , 
    api_key: process.env.API_KEY || "851347743281831", 
    api_secret: process.env.API_SECRET || "qmxMhzQag4wDl1HKhH40vi5Fz38",
  });

 
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Homeaway_dev',
    allowedFormates : ['png','jpeg','jpg']
  },
});
 
module.exports = {
    storage,
    cloudinary
}

