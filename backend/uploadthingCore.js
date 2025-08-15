// backend/uploadthingCore.js
import { createUploadthing } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();

export const ourFileRouter = {
  videoUploader: f({ video: { maxFileSize: "1GB" } })
    .input(z.object({}))
    .onUploadComplete(({ file }) => {
      console.log("Uploaded:", file.url);
    }),
};
