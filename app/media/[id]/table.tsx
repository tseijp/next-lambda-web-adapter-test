import Datetime from "@/app/_atoms/DateTime";
import Table, { LinkedTableRow } from "@/app/_atoms/Table";
import { FilePreview } from "@/app/media/client";
import { invoker } from "@/infra/invoker";
import React from "react";

const app = invoker();

interface BlobTableProps {
  path: string;
}

export default async function BlobTable(props: BlobTableProps) {
  const { path } = props;
  const res = await app.blobs.$get();
  if (!res.ok) return "Error";
  const blobs = await res.json();

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