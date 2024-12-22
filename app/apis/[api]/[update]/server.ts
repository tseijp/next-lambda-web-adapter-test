"use server";

import { invoker } from "@/infra/invoker";

const app = invoker();

export async function updatePagesAction(
  api: string,
  pathname: string,
  formData: FormData
) {
  try {
    const [forms, items] = await Promise.all([
      models.forms.listByApi(api),
      models.items.listByPathname(pathname),
    ]);
    await Promise.all(
      forms.map((form) => {
        const content = formData.get(form.form_name!)!;
        const item = items.find(({ form_id }) => form_id === form.id);
        if (item) return models.items.update({ ...item, content });
        return models.items.create({ pathname, form_id: form.id, content });
      })
    );
    const redirect = `/apis/${api}`;
    return { statusCode: 200, message: "", redirect };
  } catch (error) {
    console.error(error);
    return { statusCode: 500 };
  }
}
