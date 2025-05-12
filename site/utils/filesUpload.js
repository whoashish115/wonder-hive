export const filesUpload = async (files) => {
  try {
    let fileArray = [];

    for (const item of files) {
      const formData = new FormData();

      formData.append("file", item);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      );

      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      fileArray.push({ public_id: data.public_id, url: data.secure_url });
    }

    return fileArray;
  }
  catch {
    return []
  }
};
