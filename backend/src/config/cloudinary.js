import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "earnease/employer_licenses",
    allowed_formats: ["pdf", "jpg", "png", "jpeg"],
    resource_type: "auto",
  },
});

const studentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "earnease/students",
    allowed_formats: ["jpg", "jpeg", "png"], 
    resource_type: "image",
  },
})

export const upload = multer({ storage });
export const uploadStudent = multer({storage: studentStorage})
export { cloudinary };