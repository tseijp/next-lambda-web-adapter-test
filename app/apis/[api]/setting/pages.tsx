import PagesTable from "@/app/apis/[api]/table";
import Border from "@/app/_atoms/Border";
import Button from "@/app/_atoms/Button";
import Field from "@/app/_atoms/Field";
import Form from "@/app/_atoms/Form";
import Header from "@/app/_atoms/Header";
import Modal from "@/app/_atoms/Modal";
import Title from "@/app/_atoms/Title";
import {
  CreateForm,
  RemoveForm,
  ConditionalDelete,
} from "@/app/apis/[api]/setting/client";
import { FORM_TYPES } from "@/app/const";
import { Fragment } from "react/jsx-runtime";
import { invoker } from "@/infra/invoker";
import {
  removeApisAction,
  removePagesAction,
  updateFormsAction,
} from "./server";

const app = invoker();

interface Props {
  api: string;
}

export default async function CMSApisIdSettingPage(props: Props) {
  const { api } = props;
  const [res0, res1] = await Promise.all([
    app.forms.api[":api"].$get({ param: { api } }),
    app.pages.api[":api"].$get({ param: { api } }),
  ]);

  const [forms, pages] = await Promise.all([res0.json(), res1.json()]);

  return (
    <>
      <Form _action={updateFormsAction.bind(null, api)}>
        <Header
          active
          title={api}
          href={`/apis/${api}/setting`}
          setting="API 設定"
        >
          <div className="flex justify-end w-full gap-2.5">
            <Button type="submit" className="text-white bg-[#FB773F]">
              更新
            </Button>
          </div>
        </Header>
        <Title title="API スキーマ">
          {forms.map((form, index) => (
            <Fragment key={index}>
              <div className="relative flex w-full gap-10">
                <RemoveForm api={api} formId={form.id} />
                <div className="flex flex-col w-full">
                  <Field
                    title="APIキー"
                    name="name"
                    defaultValue={form.form_name ?? ""}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <Field
                    title="表示名"
                    name="title"
                    defaultValue={form.form_title ?? ""}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <Field title="タイプ" name="type" form_type="select">
                    {FORM_TYPES.map((type, index) => (
                      <option
                        value={type.type}
                        key={index}
                        selected={form.form_type === type.type}
                      >
                        {type.title}
                      </option>
                    ))}
                  </Field>
                </div>
              </div>
              <Border />
            </Fragment>
          ))}
          <CreateForm api={api} />
        </Title>
      </Form>
      <Title title="削除したコンテンツ">
        <div>
          <PagesTable api={api} isDeleted />
        </div>
      </Title>
      <Title title="重要な操作">
        <Modal className="mx-auto w-[500px] -top-2">
          <Button className="flex-0 h-12 border border-[#DC2647] text-[#DC2647] hover:opacity-50 disabled:opacity-25">
            コンテンツを完全に削除
          </Button>
          <Form _action={removePagesAction.bind(null, api)} className="p-10">
            <ConditionalDelete value={api} />
          </Form>
        </Modal>
        <Modal className="mx-auto w-[500px] -top-2">
          <Button
            disabled={pages.length > 0}
            className="flex-0 h-12 border border-[#DC2647] text-[#DC2647] hover:opacity-50 disabled:opacity-25"
          >
            API を完全に削除
          </Button>
          <Form _action={removeApisAction.bind(null, api)} className="p-10">
            <ConditionalDelete value={api} />
          </Form>
        </Modal>
      </Title>
    </>
  );
}
