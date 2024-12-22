import Button from "@/app/_atoms/Button";
import Form from "@/app/_atoms/Form";
import Header from "@/app/_atoms/Header";
import Field from "@/app/_atoms/Field";
import Title from "@/app/_atoms/Title";
import { invoker } from "@/infra/invoker";
import { updatePagesAction } from "./server";

const app = invoker();

interface Props {
  api: string;
  update: string;
}

export default async function CMSApisIdUpdatePage(props: Props) {
  const { api, update: pathname } = props;
  const res = await app.pages[":pathname"].$get({ param: { pathname } });
  if (!res.ok) return "Pages Not Found";

  const [res0, res1] = await Promise.all([
    app.forms.api[":api"].$get({ param: { api } }),
    app.items.apis[":pathname"].$get({ param: { pathname } }),
  ]);

  const [forms, items] = await Promise.all([res0.json(), res1.json()]);

  const getValue = (id: number) => {
    const current = items.find(({ form_id }) => form_id === id);
    return current?.content ?? "";
  };

  return (
    <Form _action={updatePagesAction.bind(null, api, pathname)}>
      <Header title={api} setting="API 設定" href={`/apis/${api}/setting`}>
        {/* <Button className="text-[#563BFE] border border-[#563BFE]">
            下書きを保存
          </Button> */}
        <div />
        <Button type="submit" className="text-white bg-[#FB773F]">
          更新
        </Button>
      </Header>
      <Title title="コンテンツ">
        {forms.map(({ id, form_name, form_type, form_title }) => (
          <Field
            key={id}
            name={form_name ?? ""}
            title={form_title ?? ""}
            defaultValue={getValue(id) as string}
            form_type={form_type}
          />
        ))}
      </Title>
    </Form>
  );
}
