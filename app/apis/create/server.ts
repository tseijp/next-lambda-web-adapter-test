"use server";

export async function createApisAction(formData: FormData) {
  try {
    const title = formData.get("title") as string | null;
    const api = formData.get("api") as string | null;
    if (!title || !api) throw new Error(`apis/create Error: no title or api`);

    // insert new api
    await models.apis.create({ title, api });
    const redirect = `/apis/${api}/setting`;
    return { statusCode: 200, redirect };
  } catch (error) {
    console.error(error);
    return { statusCode: 500 };
  }
}
