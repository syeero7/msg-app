export const VALIDATION_ERROR_MESSAGE = {
  letter: "must only contain letters",
  number: "must only contain numbers",
  maxLength: (max) => `cannot exceed ${max} characters`,
  lengthRange: (min, max) => `must be between ${min} and ${max} characters`,
};

export const MAX_FILE_UPLOAD_SIZE_IN_MEGA_BYTES = 3;

export const UPLOAD_IMAGE_SIZE_IN_PIXELS = 300;
