import Header from "@/app/_atoms/Header";
import { DeleteButton, UploadButton } from "@/app/media/client";
import React from "react";
import BlobTable from "./table";
import BlobPreview from "./preview";
import { createBlobsAction, removeBlobsAction, updateBlobsAction } from "./server";

interface Props {
  params: Promise<{ id: string }>;
  // @TODO FIX
  // path: string;
  children: React.ReactNode;
}

export default async function MediaPage(props: Props) {
  const { params } = props;
  const { id } = await params;
  const blobId = Number(id);
  return (
    <>
      <Header title="メディア管理">
        <input
          placeholder="検索"
          className="rounded px-3 w-60 h-10 bg-[#F8F9FD]"
        />
        <UploadButton
          plus
          _action={createBlobsAction}
          className="text-white rounded bg-[#563BFE]"
        >
          アップロード
        </UploadButton>
      </Header>
      <div className="mx-10 mt-5 flex">
        {/* @TODO FIX */}
        <BlobTable path={"path"} />
        <div className="shrink-0 w-[340px] h-full pl-12 top-9 right-0 flex flex-col gap-4">
          <BlobPreview blobId={blobId} />
          <div className="fixed right-10 bottom-10 flex gap-4">
            <UploadButton
              _action={updateBlobsAction.bind(null, blobId)}
              className="w-[162px] h-12 border border-[#563BFF] text-[#563BFF] hover:opacity-50"
            >
              再アップロード
            </UploadButton>
            <DeleteButton
              _action={removeBlobsAction.bind(null, blobId)}
              blobId={blobId}
              className="w-[162px] h-12 border border-[#DC2647] text-[#DC2647] hover:opacity-50"
            >
              削除
            </DeleteButton>
          </div>
        </div>
      </div>
    </>
  );
}
