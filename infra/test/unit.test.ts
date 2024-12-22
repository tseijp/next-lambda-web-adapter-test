import { TEST_CSV } from "./unit.csv";
import { testClient } from "hono/testing";
import { beforeAll, describe, expect, it } from "@jest/globals";
import { routes } from "../handler";
import { randomUUID } from "crypto";

interface ParsedCSV {
  code: string;
  pref: string;
  city: string;
  pref_kana: string;
  city_kana: string;
}

function* parseCSV() {
  const lines = TEST_CSV.split("\n");
  for (const line of lines) {
    // 団体コード,都道府県名（漢字）,市区町村名（漢字）,都道府県名（カナ）,市区町村名（カナ）
    const [code, pref, city, pref_kana, city_kana] = line.split(",");
    yield { code, pref, city, pref_kana, city_kana } as ParsedCSV;
  }
}

const DEFAULT_FORMS = [
  { form_name: "pref", form_title: "都道府県名（漢字）" },
  { form_name: "city", form_title: "市区町村名（漢字）" },
  { form_name: "pref_kana", form_title: "都道府県名（カナ）" },
  { form_name: "city_kana", form_title: "市区町村名（カナ）" },
];

const test_csv = parseCSV();

const $ = testClient(routes);

beforeAll(async () => {
  await $.init.$get();
});

describe("Database Integration Tests", () => {
  // it("create api and pages", async () => {
  //   let _item: ParsedCSV;
  //   let cache = { pref: 0, city: 0, pref_kana: 0, city_kana: 0 };
  //   for (const item of test_csv)
  //     if (!item.city) {
  //       // Create api, forms and root pages
  //       _item = item;
  //       const [pref, city, pref_kana, city_kana] = await Promise.all([
  //         ...DEFAULT_FORMS.map((form) =>
  //           $.forms.$post({ json: { api: item.code, ...form } as any })
  //         ),
  //         $.apis.$post({ json: { api: item.code, title: item.pref } }),
  //         $.pages.$post({ json: { pathname: item.code, title: item.pref } })
  //       ]);
  //       Object.assign(cache, { pref, city, pref_kana, city_kana });
  //     } else {
  //       // create pages and forms
  //       await Promise.all([
  //         $.pages.$post({
  //           json: {
  //             pathname: item.code,
  //             title: item.city ?? null,
  //             api: _item!.code,
  //           },
  //         }),
  //         ...DEFAULT_FORMS.map(({ form_name }) =>
  //           $.items.$post({
  //             json: {
  //               pathname: item.code,
  //               form_id: (cache as any)[form_name],
  //               content: (item as any)[form_name],
  //             },
  //           })
  //         ),
  //       ]);
  //     }
  // });

  /**
   * CRUD operations
   */
  it("CRUD operations on apis", async () => {
    const param = { api: randomUUID() };
    const json = { title: "updated" };

    // req utils

    const req = async () => {
      const res = await $.apis[":api"].$get({ param });
      return res.ok ? await res.json() : null;
    };

    // Create a new api
    await $.apis.$post({ json: param });
    let item = await req();
    expect(item).toBeDefined();

    // Update the api
    await $.apis[":api"].$patch({ param, json });
    item = await req();
    expect(item!?.title).toBe("updated");

    // delete the api
    await $.apis[":api"].$delete({ param });
    item = await req();
    expect(item).toBe(null);
  });

  it("CRUD operations on blobs", async () => {
    const json = {
      file_data: "image_data",
      file_name: "image.jpg",
      file_type: "image/jpeg",
    };

    // Create the blob
    const insert = await $.blobs.$post({ json });
    const result = await insert.json();
    const id = result.ok.toString();

    // req utils
    const req = async () => {
      const res = await $.blobs[":id"].$get({ param: { id } });
      return res.ok ? await res.json() : null;
    };

    // check
    let item = await req();
    expect(item).toBeDefined();

    // Update the blob
    json.file_data = "Updated";
    await $.blobs[":id"].$patch({ json, param: { id } });
    item = await req();
    expect(item!?.file_data).toBe("Updated");

    // Delete the blob
    await $.blobs[":id"].$delete({ param: { id } });
    item = await req();
    expect(item).toBe(null);
  });

  it("CRUD operations on pages", async () => {
    // req utils

    const param = { pathname: randomUUID() };
    const req = async () => {
      const res = await $.pages[":pathname"].$get({ param });
      return res.ok ? await res.json() : null;
    };

    // Create a page
    await $.pages.$post({ json: param });
    let item = await req();
    expect(item).toBeDefined();

    // Update the page
    const json = { title: "Updated" };
    await $.pages[":pathname"].$patch({ json, param });
    item = await req();
    expect(item!?.title).toBe("Updated");

    // Logically delete the page
    await $.pages[":pathname"].$delete({ param });
    item = await req();
    expect(item).toBe(null);

    // delete trashed page
    await $.pages[":pathname"].trash.$delete({ param });
    // @TODO expect
  });

  it("CRUD operations on items", async () => {
    // Create a content item
    const json = { content: "Created" };
    const insert = await $.items.$post({ json });
    const result = await insert.json();
    const param = { id: result.ok.toString() };

    // req utils
    const req = async () => {
      const res = await $.items[":id"].$get({ param });
      return res.ok ? await res.json() : null;
    };

    // check
    let item = await req();
    expect(item).toBeDefined();

    // Update the content item
    json.content = "Updated";
    await $.items[":id"].$patch({ json, param });
    item = await req();
    // expect(item!?.content).toBe("Updated"); @TODO FIX

    // delete the content item
    await $.items[":id"].$delete({ param });
    item = await req();
    // expect(item).toBe(null); @TODO FIX
  });
});
