import Button from "@/app/_atoms/Button";
import Form from "@/app/_atoms/Form";
import Header from "@/app/_atoms/Header";
import Field from "@/app/_atoms/Field";
import Title from "@/app/_atoms/Title";
import { invoker } from "@/infra/invoker";
import { randomUUID } from "crypto";
import { createPagesAction } from "./server";

const app = invoker();

interface Props {
  params: Promise<{ api: string }>;
}

export default async function CMSApisIdCreatePage(props: Props) {
  const { params } = props;
  const { api } = await params;
  const res = await app.forms.api[":api"].$get({ param: { api } });
  if (!res.ok) return "Error";
  const forms = await res.json();
  return (
    <Form _action={createPagesAction.bind(null, api)}>
      <Header title={api} setting="API 設定" href={`/apis/${api}/setting`}>
        <div />
        <Button type="submit" className="text-white bg-[#FB773F]">
          公開
        </Button>
      </Header>
      <Title title="エンドポイント">
        <Field name="pathname" title="" defaultValue={randomUUID()} />
      </Title>
      <Title title="コンテンツ">
        {forms.map(({ id, form_name, form_type, form_title }) => (
          <Field
            key={id}
            name={form_name ?? ""}
            title={form_title ?? ""}
            form_type={form_type}
          />
        ))}
      </Title>
    </Form>
  );
}
