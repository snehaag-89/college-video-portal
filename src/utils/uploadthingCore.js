import { generateUploadButton } from "@uploadthing/react";
import { generateReactHelpers } from "@uploadthing/react";

export const UploadButton = generateUploadButton({
  endpoint: "videoUploader",
});

export const { useUploadThing } = generateReactHelpers({
  endpoint: "videoUploader",
});
