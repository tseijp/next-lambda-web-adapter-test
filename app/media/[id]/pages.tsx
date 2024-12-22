import Datetime from "@/app/_atoms/DateTime";
import Header from "@/app/_atoms/Header";
import Table, { LinkedTableRow } from "@/app/_atoms/Table";
import { DeleteButton, UploadButton } from "@/app/media/client";
import { FilePreview } from "@/app/media/client";
import React from "react";

interface BlobTableProps {
  path: string;
}

export async function BlobTable(props: BlobTableProps) {
  const { path } = props;
  const blobs = await models.blobs.list();
  return (
    <Table>
      <tr className="flex border-bottom border-[#E5E5F2]">
        <th />
        <th>ファイル名</th>
        <th>形式</th>
        <th>作成日</th>
        <th>更新日</th>
      </tr>
      {blobs.map((blob) => (
        <LinkedTableRow
          key={blob.id}
          href={`/media/${blob.id}`}
          active={`/media/${blob.id}` === path}
        >
          <td className="h-[112px]">
            <FilePreview blob={blob} className="h-16" />
          </td>
          <td>{blob.file_name}</td>
          <td>
            <a href={`${blob.id}`}>{blob.file_type}</a>
          </td>
          <td>
            <Datetime date={blob.created_at} />
          </td>
          <td>
            <Datetime datetime={blob.updated_at} />
          </td>
        </LinkedTableRow>
      ))}
    </Table>
  );
}

interface BlobPreviewProps {
  blobId: number | null; // NaN if not selected
}

export async function BlobPreview(props: BlobPreviewProps) {
  const { blobId } = props;
  if (!blobId && blobId !== 0) return null;
  const blob = await models.blobs.get(blobId);
  if (!blob) return "Blob Not Found";
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
        <div>{(blob.file_size / 1024 / 1024).toFixed(2)} MB</div>
      </div>
    </>
  );
}

interface Props {
  id: string;
  path: string;
  children: React.ReactNode;
}

export default async function MediaPage(props: Props) {
  const { id, path } = props;
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
          _action={actions.blobs.create}
          className="text-white rounded bg-[#563BFE]"
        >
          アップロード
        </UploadButton>
      </Header>
      <div className="mx-10 mt-5 flex">
        <BlobTable path={path} />
        <div className="shrink-0 w-[340px] h-full pl-12 top-9 right-0 flex flex-col gap-4">
          <BlobPreview blobId={blobId} />
          <div className="fixed right-10 bottom-10 flex gap-4">
            <UploadButton
              _action={actions.blobs.update.bind(null, blobId)}
              className="w-[162px] h-12 border border-[#563BFF] text-[#563BFF] hover:opacity-50"
            >
              再アップロード
            </UploadButton>
            <DeleteButton
              _action={actions.blobs.remove.bind(null, blobId)}
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
