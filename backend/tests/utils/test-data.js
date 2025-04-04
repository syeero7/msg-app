import sharp from "sharp";

export const userInput = {
  firstName: "John",
  lastName: "Doe",
  email: "john1@mail.com",
  password: "password",
  confirmPassword: "password",
};

export const getSigninUserResponseBody = async (request, server) => {
  await request(server).post("/auth/signup").send(userInput);
  const { email, password } = userInput;
  const { body } = await request(server).post("/auth/signin").send({ email, password });
  return body;
};

export const createTestImage = async (imageSize) => {
  const imgOptions = {
    width: imageSize,
    height: imageSize,
    channels: 3,
    background: { r: 255, g: 255, b: 255 },
  };
  const imageBuffer = await sharp({ create: imgOptions }).png().toBuffer();
  return imageBuffer;
};

export const createTestImageBuffer = async (size) => {
  const bytes = size * 1024 * 1024;
  const arrayBuffer = new ArrayBuffer(bytes);
  const blob = new Blob([arrayBuffer], { type: "image/png" });
  return Buffer.from(await blob.arrayBuffer());
};
