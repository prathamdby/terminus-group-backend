import { createUploadthing } from "uploadthing/express";
import { UTApi } from "uploadthing/server";

export const uploadThing = createUploadthing();
export const utapi = new UTApi();

export const uploadThingFileRouter = {
  imageUploader: uploadThing({ "image/*": { maxFileSize: "4MB" } })
    .middleware(async () => ({ userId: "system" }))
    .onUploadComplete(async ({ file }) => ({ url: file.url }))
};