import Datetime from "@/app/_atoms/DateTime";
import { FilePreview } from "@/app/media/client";
import { invoker } from "@/infra/invoker";
import React from "react";

const app = invoker();

interface BlobPreviewProps {
  blobId: number | null; // NaN if not selected
}

export default async function BlobPreview(props: BlobPreviewProps) {
  const { blobId } = props;
  if (!blobId && blobId !== 0) return null;
  const res = await app.blobs[":id"].$get({ param: { id: blobId.toString() } });
  if (!res.ok) return "Not Found"
  const blob = await res.json();
  return (
    <>
      <div className="h-[180px]">
        <FilePreview blob={blob} className="w-[340px] h-[180px]" />
      </div>
      <div className="max-w-[340px]">{blob.file_name}</div>
      <div className="grid grid-cols-[128px_1fr] gap-y-2">
        <div className="font-bold">作成日時</div>
        <div>
          <Datetime datetime={blob.created_at} />
        </div>
        <div className="font-bold">形式</div>
        <div>{blob.file_type}</div>
        <div className="font-bold">容量</div>
      </div>
    </>
  );
}
