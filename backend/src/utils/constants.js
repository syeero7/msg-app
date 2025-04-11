export const VALIDATION_ERROR_MESSAGE = {
  letter: "must only contain letters",
  number: "must only contain numbers",
  maxLength: (max) => `cannot exceed ${max} characters`,
  lengthRange: (min, max) => `must be between ${min} and ${max} characters`,
};

export const MAX_AVATAR_UPLOAD_SIZE = 3;
export const MAX_IMAGE_UPLOAD_SIZE = 5;
export const AVATAR_DIMENSIONS = { height: 300, width: 300 };
export const IMAGE_DIMENSIONS = { height: 2000, width: 2000 };
