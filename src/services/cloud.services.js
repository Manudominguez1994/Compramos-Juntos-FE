import service from "./service.config";

const uploadImageService = (imageFile) => {
  return service.post("/upload/", imageFile);
};

export { uploadImageService };