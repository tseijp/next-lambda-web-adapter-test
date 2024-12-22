"use client";

import Button from "@/app/_atoms/Button";
import Field from "@/app/_atoms/Field";
import React, { useState } from "react";
import { createFormsAction, removeFormsAction } from "./server";

interface CreateFormProps {
  params: Promise<{ api: string }>;
}

export async function CreateForm(props: CreateFormProps) {
  const { params } = props;
  const { api } = await params;
  const handleClick = async () => {
    const res = await createFormsAction(api);
    if (res.statusCode === 200) window.location.reload();
  };
  return (
    <Button
      onClick={handleClick}
      className="text-[#563BFE] border border-[#563BFE]"
    >
      <span className="mr-4">+</span>
      フィールドを追加
    </Button>
  );
}

interface RemoveFormProps {
  api: string;
  formId: number;
}

export function RemoveForm(props: RemoveFormProps) {
  const { api, formId } = props;
  const handleClick = async () => {
    const res = await removeFormsAction(api, formId);
    if (res.statusCode === 200) window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="absolute right-0 -top-6"
    >
      削除
    </button>
  );
}

export function ConditionalDelete({ value }: { value: string }) {
  const [isValid, set] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    set(value === e.target.value);
  };

  return (
    <div className="flex flex-col">
      <Field
        title={`確認：${value} と入力`}
        placeholder={value}
        onChange={handleChange}
      />
      <Button
        disabled={!isValid}
        type="submit"
        className="flex-0 h-12 border border-[#DC2647] text-[#DC2647] hover:opacity-50 disabled:opacity-25"
      >
        全てを削除
      </Button>
    </div>
  );
}
