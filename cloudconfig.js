const cloudinary = require(`cloudinary`).v2;
const { CloudinaryStorage } = require(`multer-storage-cloudinary`);
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || "your_default_cloud_name",
    api_key: process.env.CLOUD_API_KEY || "your_default_api_key",
    api_secret: process.env.CLOUD_API_SECRET || "your_default_api_secret",
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wanderlust_DEV",
    allowedFormats: ["png", "jpg", "jpeg"],
  },
});
module.exports = {
  cloudinary,
  storage,
};
if (
  !process.env.CLOUD_NAME ||
  !process.env.CLOUD_API_KEY ||
  !process.env.CLOUD_API_SECRET
) {
  throw new Error("Missing Cloudinary API credentials. Check your .env file.");
}
