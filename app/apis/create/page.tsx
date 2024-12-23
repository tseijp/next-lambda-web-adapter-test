import Button from "@/app/_atoms/Button";
import Form from "@/app/_atoms/Form";
import Field from "@/app/_atoms/Field";
import { createApisAction } from "./server";

export default async function CreatePage() {
  return (
    <>
      <h1 className="mx-auto text-center pt-20 mb-6 text-[24px] font-bold">
        API の基本情報を入力
      </h1>
      <Form
        _action={createApisAction}
        className="mx-auto p-10 max-w-[800px] flex flex-col rounded-lg bg-[#F8F9FD]"
      >
        <Field name="title" title="API 名" />
        <Field name="api" title="エンドポイント" />
        <Button type="submit" className="mt-8 text-white rounded bg-[#563BFE]">
          作成
        </Button>
      </Form>
    </>
  );
}
