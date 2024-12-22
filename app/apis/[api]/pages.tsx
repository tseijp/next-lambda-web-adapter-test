import { LinkButton } from "@/app/_atoms/Button";
import Datetime from "@/app/_atoms/DateTime";
import Dropdown from "@/app/_atoms/Dropdown";
import Header from "@/app/_atoms/Header";
import Table from "@/app/_atoms/Table";
import {
  Checkbox,
  CheckedSwitch,
  DeleteAllButton,
  DeleteButton,
  TableRow,
} from "@/app/apis/[api]/client";
// import models from "@/_server/models";

interface Props {
  api: string;
  isDeleted?: boolean;
}

export async function PagesTable(props: Props) {
  const { api, isDeleted } = props;
  const pages = isDeleted
    ? await models.pages.listTrashByApi(api)
    : await models.pages.listByApi(api);
  return (
    <>
      <div className="h-[72px] px-6 pt-4 text-[14px]">
        <CheckedSwitch pageLen={pages.length}>
          <div className="py-2 text-[14px]">
            <DeleteAllButton className="px-4 py-2" isDeleted={isDeleted}>
              コンテンツを{isDeleted ? "完全に" : ""}削除する
            </DeleteAllButton>
          </div>
        </CheckedSwitch>
      </div>
      <Table checkbox className="px-10 py-4">
        <tr className="flex border-bottom border-[#E5E5F2]">
          <th className="firstChild">
            <Checkbox pathname={pages.map((page) => page.pathname)} />
          </th>
          <th>ステータス</th>
          <th>エンドポイント</th>
          <th>名前</th>
          <th>作成日</th>
          <th>更新日</th>
          <th></th>
        </tr>
        {pages.map((page) => (
          <TableRow
            key={page.pathname}
            href={`/apis/${api}/update/${page.pathname}`}
            className="flex hover:bg-[#F2FCFF] cursor-pointer"
          >
            <td className="firstChild">
              <Checkbox pathname={page.pathname} />
            </td>
            <td>
              <span
                className={`w-3 h-3 mr-2 rounded-full ${
                  page.publish_at ? "bg-[#27DC44]" : "bg-[#02C1F7]"
                }`}
              />
              {page.publish_at ? "公開" : "非公開"}
            </td>
            <td>{page.pathname}</td>
            <td>{page.title}</td>
            <td>
              <Datetime date={page.created_at} />
            </td>
            <td>
              <Datetime datetime={page.updated_at} />
            </td>
            <td>
              <Dropdown className="w-6 h-6 grid place-content-center">
                <span className="kebabu" />
                <div className="py-2 text-[14px]">
                  <div className="px-4 py-2">
                    コンテンツをコピーして新規作成
                  </div>
                  <DeleteButton
                    isDeleted={isDeleted}
                    className="px-4 py-2 w-full text-left hover:bg- hover:bg-[#F2FCFF]"
                    pathname={page.pathname}
                  >
                    コンテンツを{isDeleted ? "完全に" : ""}削除
                  </DeleteButton>
                </div>
              </Dropdown>
            </td>
          </TableRow>
        ))}
      </Table>
    </>
  );
}

interface Props {
  api: string;
}

export default async function ApisAllPage(props: Props) {
  const { api } = props;
  return (
    <>
      <Header title={api} href={`/apis/${api}/setting`} setting="API 設定">
        <input
          placeholder="検索"
          className="rounded px-3 w-60 h-10 bg-[#F8F9FD]"
        />
        <LinkButton
          plus
          href={`/apis/${api}/create`}
          className="text-white rounded bg-[#563BFE]"
        >
          追加
        </LinkButton>
      </Header>
      <PagesTable api={api} />
    </>
  );
}