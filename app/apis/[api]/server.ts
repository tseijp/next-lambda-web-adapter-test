"use server";

export async function removeAllPagesAction(
  pathname: string,
  isDeleted = false
) {
  // try {
  //   if (isDeleted) {
  //     await models.pages.hardRemove(pathname);
  //   } else await models.pages.softRemove(pathname);
  //   return { statusCode: 200 };
  // } catch (error) {
  //   console.error(error);
  //   return { statusCode: 500 };
  // }
}
