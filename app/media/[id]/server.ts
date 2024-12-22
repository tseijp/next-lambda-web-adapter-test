"use server"

import { createBlobInput } from "@/app/utils";

export async function createBlobsAction(formData: FormData) {
  // try {
  //   const file = formData.get("file") as File;
  //   const input = await createBlobInput(file);
  //   const id = await models.blobs.create(input);
  //   const redirect = `/media/${id}`;
  //   return { statusCode: 200, message: "", redirect };
  // } catch (error) {
  //   console.error(error);
  //   return { statusCode: 500 };
  // }
}

export async function updateBlobsAction(id: number, formData: FormData) {
//   try {
//     const file = formData.get("file") as File;
//     const input = await createBlobInput(file);
//     await models.blobs.update({ id, ...input });
//     const redirect = `/media/${id}`;
//     return { statusCode: 200, message: "", redirect };
//   } catch (error) {
//     console.error(error);
//     return { statusCode: 500 };
//   }
// }
// export async function removeBlobsAction(blobId: number) {
//   try {
//     await models.blobs.remove(blobId);
//     return { statusCode: 200, message: "" };
//   } catch (error) {
//     console.error(error);
//     return { statusCode: 500 };
//   }
}

export async function removeBlobsAction() {}
