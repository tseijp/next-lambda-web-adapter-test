import { LinkButton } from "@/app/_atoms/Button";
import Datetime from "@/app/_atoms/DateTime";
import Header from "@/app/_atoms/Header";
import Table from "@/app/_atoms/Table";
import { TableRow } from "@/app/apis/[api]/client";
import { invoker } from "@/infra/invoker";

const app = invoker();

export default async function ApisPage() {
  const res = await app.apis.$get()
  if (!res.ok) return null;
  const apis = await res.json();
  return (
    <>
      <Header title="API 管理">
        <input
          placeholder="検索"
          className="rounded px-3 w-60 h-10 bg-[#F8F9FD]"
        />
        <LinkButton
          plus
          href={`/apis/create`}
          className="text-white rounded bg-[#563BFE]"
        >
          追加
        </LinkButton>
      </Header>
      <Table className="px-10 py-4">
        <tr className="flex border-bottom border-[#E5E5F2]">
          <th>API 名</th>
          <th>エンドポイント</th>
          <th>作成日</th>
          <th>更新日</th>
        </tr>
        {apis.map((item) => (
          <TableRow
            key={item.api}
            href={`/apis/${item.api}`}
            className="flex hover:bg-[#F2FCFF] cursor-pointer"
          >
            <td>{item.title}</td>
            <td>{item.api}</td>
            <td>
              <Datetime date={item.created_at} />
            </td>
            <td>
              <Datetime datetime={item.updated_at} />
            </td>
          </TableRow>
        ))}
      </Table>
    </>
  );
}
