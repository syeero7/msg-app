import { v2 as cloudinary } from "cloudinary";

class Cloudinary {
  #FOLDER = "msg-app";

  async uploadFile(file, filepath) {
    const { buffer, mimetype } = file;
    const base64 = Buffer.from(buffer).toString("base64");
    const dataURI = `data:${mimetype};base64,${base64}`;

    const folder = `${this.#FOLDER}/${filepath}`;
    const { secure_url } = await cloudinary.uploader.upload(dataURI, { folder });

    return secure_url;
  }

  async deleteFile(filepath) {
    const folder = `${this.#FOLDER}/${filepath}`;
    const folderExists = await this.#checkFolderExists(folder);

    if (folderExists) {
      await cloudinary.api.delete_resources_by_prefix(folder);
      await cloudinary.api.delete_folder(folder);
    }
  }

  async #checkFolderExists(folder) {
    try {
      await cloudinary.api.resources_by_asset_folder(folder);
      return true;
    } catch {
      return false;
    }
  }
}

export const cloudinaryAPI = new Cloudinary();
