import { createUploadthing } from "uploadthing/server"; // ✅ removed 'type FileRouter'

const f = createUploadthing();

export const ourFileRouter = {
  videoUploader: f({
    video: { maxFileSize: "64MB" }, // ✅ max size
  })
    .onUploadComplete(async ({ file }) => {
      console.log("✅ Upload complete!", file.url); // ✅ log file URL
      // You can save this to DB if needed
    }),
};
