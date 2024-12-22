"use server";

export async function createFormsAction(api: string) {
  // try {
  //   await models.forms.create({ api });
  //   const redirect = `/apis/${api}/setting`;
  //   return { statusCode: 200, redirect };
  // } catch (error) {
  //   console.error(error);
  //   return { statusCode: 500 };
  // }
}

export async function updateFormsAction(api: string, formData: FormData) {
  // const names = formData.getAll("name");
  // const types = formData.getAll("type");
  // const titles = formData.getAll("title");
  // try {
  //   const forms = await models.forms.listByApi(api);
  //   const awaits = forms.map((form, index) => {
  //     const form_name = names[index] as string;
  //     const form_type = types[index] as FormType;
  //     const form_title = titles[index] as string;
  //     return models.forms.update({ ...form, form_name, form_type, form_title });
  //   });
  //   await Promise.all(awaits);
  //   const redirect = `/apis/${api}`;
  //   return { statusCode: 200, redirect };
  // } catch (error) {
  //   console.error(error);
  //   return { statusCode: 500 };
  // }
}

export async function removeApisAction(api: string) {
  // try {
  //   await models.apis.remove(api);
  //   const redirect = `/apis`;
  //   return { statusCode: 200, redirect };
  // } catch (error) {
  //   console.error(error);
  //   return { statusCode: 500 };
  // }
}


export async function removeFormsAction(api: string, id: number) {
  // try {
  //   const items = await models.items.listByForm(id);
  //   await Promise.all([
  //     models.forms.remove(id),
  //     ...items.map((item) => models.items.remove(item.id)),
  //   ]);
  //   const redirect = `/apis/${api}/setting`;
  //   return { statusCode: 200, redirect };
  // } catch (error) {
  //   console.error(error);
  //   return { statusCode: 500 };
  // }
}

export async function removePagesAction(api: string) {
  // try {
  //   const [pages, trashes] = await Promise.all([
  //     models.pages.listByApi(api),
  //     models.pages.listTrashByApi(api),
  //   ]);
  //   await Promise.all([
  //     ...pages.map((page) => models.pages.hardRemove(page.pathname)),
  //     ...trashes.map((page) => models.pages.hardRemove(page.pathname)),
  //   ]);
  //   const redirect = `/apis/${api}`;
  //   return { statusCode: 200, message: "", redirect };
  // } catch (error) {
  //   console.error(error);
  //   return { statusCode: 500 };
  // }
}