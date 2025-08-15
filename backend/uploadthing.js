// backend/uploadthing.js
import { createUploadthing, createUploadthingExpressHandler } from "@uploadthing/express";

const f = createUploadthing();

export const uploadRouter = {
  videoUploader: f({
    video: { maxFileSize: "1GB" }, // Only videos allowed
  })
    .onUploadComplete(async ({ file }) => {
      console.log("✅ Uploaded file URL:", file.url);
      return { url: file.url };
    }),
};

export const uploadthingHandler = createUploadthingExpressHandler({
  router: uploadRouter,
});
