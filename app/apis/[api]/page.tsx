import { LinkButton } from "@/app/_atoms/Button";
import Header from "@/app/_atoms/Header";
import PagesTable from "./table";

interface Props {
  params: Promise<{ api: string }>;
}

export default async function ApisAllPage(props: Props) {
  const { params } = props;
  const { api } = await params;
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
