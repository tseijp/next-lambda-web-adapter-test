"use server";

export async function createPagesAction(api: string, formData: FormData) {
  try {
    const forms = await models.forms.listByApi(api);
    const pathname = (formData.get("pathname") as string) || `${randomUUID()}`;
    const title = (formData.get("title") as string) || "";
    await Promise.all([
      ...forms.map((form) =>
        models.items.create({
          pathname,
          form_id: form.id,
          content: formData.get(form.form_name!) as string,
        })
      ),
      models.pages.create({
        api,
        pathname,
        title,
        metadata: "{}",
      }),
    ]);
    return { statusCode: 200, message: "", redirect: `/apis/${api}` };
  } catch (error) {
    console.error(error);
    return { statusCode: 500 };
  }
}
