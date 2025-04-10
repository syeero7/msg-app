import sharp from "sharp";

const validateImage = (multer, fieSize, imageWidth, imageHight, imageSizeCondition) => {
  return [
    multer,
    async (req, res, next) => {
      if (!req.file) {
        const err = new Error("No upload file");
        err.statusCode = 400;
        return next(err);
      }

      const { mimetype, size, buffer } = req.file;
      const imageTypes = ["image/jpg", "image/jpeg", "image/png"];

      if (!imageTypes.includes(mimetype)) {
        const err = new Error("File format must be either JPEG or PNG");
        err.statusCode = 400;
        return next(err);
      }

      if (size / (1024 * 1024) > fieSize) {
        const err = new Error(`File size exceeds the maximum limit of ${fieSize}MB`);
        err.statusCode = 400;
        return next(err);
      }

      const { height, width } = await sharp(buffer).metadata();
      const isImageSizeError =
        imageSizeCondition === "!=="
          ? height !== imageHight || width !== imageWidth
          : imageSizeCondition === ">"
          ? height > imageHight || width > imageWidth
          : false;

      if (isImageSizeError) {
        const err = new Error(`uploaded image must be ${imageWidth} x ${imageHight}`);
        err.statusCode = 400;
        return next(err);
      }

      next();
    },
  ];
};

export default validateImage;
