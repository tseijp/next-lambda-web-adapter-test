// infra/handler.ts
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import * as sqlite3 from "sqlite3";
import { z, ZodRawShape } from "zod";
import { all, one, run } from "./utils";
import { Apis, Blobs, Forms, Items, Pages } from "./types";
import schema from "./schema.sql";
import { serve } from "@hono/node-server";

const isLocal = process.env.RUNTIME_ENV === "local";

const isServe = process.env.RUNTIME_ENV === "serve";

const DB_PATH = isLocal || isServe ? "./db.sqlite3" : "/mnt/db/db.sqlite";

export const db = new sqlite3.Database(DB_PATH);

export const app = new Hono();

const json = <T extends ZodRawShape>(shape: T) => {
  return zValidator("json", z.object(shape));
};

export const routes = app
  .get("/init", async (c) => {
    const queries = schema
      .split(";")
      .map((q) => q.trim())
      .filter(Boolean)
      .filter((q) => !q.startsWith("--"));
    for (const q of queries) await run(q);
    return c.json({ ok: true });
  })
  /************************************************************************************
   * apis item by id
   */
  .get("/apis/:api", async (c) => {
    const api = c.req.param("api");
    const q = /* SQL */ `SELECT * FROM apis WHERE api = ?`;
    const res = await one<Apis>(q, api);
    if (!res) return c.text("Not found", 404);
    return c.json(res);
  })
  // apis list
  .get("/apis", async (c) => {
    const q = /* SQL */ `SELECT * FROM apis`;
    const res = await all<Apis[]>(q);
    return c.json(res);
  })
  // apis create
  .post(
    "/apis",
    json({ title: z.string().optional(), api: z.string() }),
    async (c) => {
      const q = /* SQL */ `INSERT INTO apis (title, api) VALUES (?, ?)`;
      const { title, api } = c.req.valid("json");
      const ok = await run(q, title, api);
      return c.json({ ok });
    }
  )
  // apis update by api
  .patch("/apis/:api", json({ title: z.string().optional() }), async (c) => {
    const q = /* SQL */ `UPDATE apis SET title = ?, updated_at = datetime("now") WHERE api = ?`;
    const api = c.req.param("api");
    const { title } = c.req.valid("json");
    const ok = await run(q, title, api);
    return c.json({ ok });
  })
  // apis delete by api
  .delete("/apis/:api", async (c) => {
    const q = /* SQL */ `DELETE FROM apis WHERE api = ?`;
    const api = c.req.param("api");
    const ok = await run(q, api);
    return c.json({ ok });
  })
  /************************************************************************************
   * blobs item by id
   */
  .get("/blobs/:id", async (c) => {
    const q = /* SQL */ `SELECT * FROM blobs WHERE id = ?`;
    const id = c.req.param("id");
    const res = await one<Blobs>(q, id);
    if (!res) return c.text("Not found", 404);
    return c.json(res);
  })
  // blobs list
  .get("/blobs", async (c) => {
    const q = /* SQL */ `SELECT * FROM blobs`;
    const res = await all<Blobs[]>(q);
    return c.json(res);
  })
  // blobs create
  .post(
    "/blobs",
    json({
      file_data: z.string(),
      file_name: z.string(),
      file_type: z.string(),
    }),
    async (c) => {
      const q = /* SQL */ `INSERT INTO blobs (file_data, file_name, file_type) VALUES (?, ?, ?)`;
      const { file_data, file_name, file_type } = c.req.valid("json");
      const ok = await run(q, file_data, file_name, file_type);
      return c.json({ ok });
    }
  )
  // blobs update by id
  .patch(
    "/blobs/:id",
    json({
      file_data: z.string(),
      file_name: z.string(),
      file_type: z.string(),
    }),
    async (c) => {
      const q = /* SQL */ `UPDATE blobs SET file_data = ?, file_name = ?, file_type = ?, updated_at = datetime("now") WHERE id = ?`;
      const { file_data, file_name, file_type } = c.req.valid("json");
      const id = c.req.param("id");
      const ok = await run(q, file_data, file_name, file_type, id);
      return c.json({ ok });
    }
  )
  // blobs delete by id
  .delete("/blobs/:id", async (c) => {
    const q = /* SQL */ `DELETE FROM blobs WHERE id = ?`;
    const id = c.req.param("id");
    const ok = await run(q, id);
    return c.json({ ok });
  })
  /************************************************************************************
   * forms item by id
   */
  .get("/forms/:id", async (c) => {
    const q = /* SQL */ `SELECT * FROM forms`;
    const res = await one<Forms>(q);
    if (!res) return c.text("Not found", 404);
    return c.json(res);
  })
  // forms list
  .get("/forms", async (c) => {
    const q = /* SQL */ `SELECT * FROM forms`;
    const res = await all<Forms[]>(q);
    return c.json(res);
  })
  // forms list by api
  // @TODO FIX api to apis
  .get("/forms/api/:api", async (c) => {
    const q = /* SQL */ `SELECT * FROM forms WHERE api = ?`;
    const api = c.req.param("api");
    const res = await all<Forms[]>(q, api);
    return c.json(res);
  })
  // forms create
  .post(
    "/forms",
    json({
      api: z.string(),
      form_name: z.string(),
      form_type: z.string(),
      form_title: z.string(),
    }),
    async (c) => {
      const q = /* SQL */ `INSERT INTO forms (api, form_name, form_type, form_title) VALUES (?, ?, ?, ?)`;
      const { api, form_name, form_type, form_title } = c.req.valid("json");
      const ok = await run(q, api, form_name, form_type, form_title);
      return c.json({ ok });
    }
  )
  // forms update by id
  .patch(
    "/forms/:id",
    json({
      api: z.string(),
      form_name: z.string().optional(),
      form_type: z.string().optional(),
      form_title: z.string().optional(),
      id: z.string(),
    }),
    async (c) => {
      const q = /* SQL */ `UPDATE forms SET api = ?, form_name = ?, form_type = ?, form_title = ?, updated_at = datetime("now") WHERE id = ?`;
      const { api, form_name, form_type, form_title, id } = c.req.valid("json");
      const ok = await run(q, api, form_name, form_type, form_title, id);
      return c.json({ ok });
    }
  )
  // forms delete by id
  .delete("/forms/:id", async (c) => {
    const q = /* SQL */ `DELETE FROM forms WHERE id = ?`;
    const id = c.req.param("id");
    const ok = await run(q, id);
    return c.json({ ok });
  })
  /************************************************************************************
   * items item by id
   */
  .get("/items/:id", async (c) => {
    const q = /* SQL */ `SELECT * FROM items WHERE id = ?`;
    const id = c.req.param("id");
    const res = await one<Items>(q, id);
    if (!res) return c.text("Not found", 404);
    return c.json(res);
  })
  // items list
  .get("/items", async (c) => {
    const q = /* SQL */ `SELECT * FROM items`;
    const res = await all<Items[]>(q);
    return c.json(res);
  })
  // items list by pathname
  // @TODO FIX apis to pages
  .get("/items/apis/:pathname", async (c) => {
    const q = /* SQL */ `SELECT * FROM items WHERE pathname = ?`;
    const pathname = c.req.param("pathname");
    const res = await all<Items[]>(q, pathname);
    return c.json(res);
  })
  // items list by form_id
  .get("/items/forms/:form_id", async (c) => {
    const q = /* SQL */ `SELECT * FROM items WHERE form_id = ?`;
    const form_id = c.req.param("form_id");
    const res = await all<Items[]>(q, form_id);
    return c.json(res);
  })
  .post(
    "/items",
    json({
      blob_id: z.string().optional(),
      form_id: z.string().optional(),
      content: z.string().optional(),
      pathname: z.string().optional(),
    }),
    async (c) => {
      const q = /* SQL */ `INSERT INTO items (blob_id, form_id, content, pathname) VALUES (?, ?, ?, ?)`;
      const { blob_id, form_id, content, pathname } = c.req.valid("json");
      const ok = await run(q, blob_id, form_id, content, pathname);
      return c.json({ ok });
    }
  )
  .patch(
    "/items/:id",
    json({
      blob_id: z.string().optional(),
      form_id: z.string().optional(),
      content: z.string().optional(),
    }),
    async (c) => {
      const q = /* SQL */ `UPDATE items SET blob_id = ?, form_id = ?, content = ?, updated_at = datetime("now") WHERE id = ?`;
      const id = c.req.param("id");
      const { blob_id, form_id, content } = c.req.valid("json");
      const ok = await run(q, blob_id, form_id, content, id);
      return c.json({ ok });
    }
  )
  .delete("/items/:id", async (c) => {
    const q = /* SQL */ `DELETE FROM items WHERE id = ?`;
    const id = c.req.param("id");
    const ok = await run(q, id);
    return c.json({ ok });
  })
  /************************************************************************************
   * pages item by pathname
   */
  .get("/pages/:pathname", async (c) => {
    const q = /* SQL */ `SELECT * FROM pages WHERE pathname = ? AND deleted_at IS NULL`;
    const pathname = c.req.param("pathname");
    const res = await one<Pages>(q, pathname);
    if (!res) return c.text("Not found", 404);
    return c.json(res);
  })
  // pages list
  .get("/pages", async (c) => {
    const q = /* SQL */ `SELECT * FROM pages WHERE deleted_at IS NULL`;
    const res = await all<Pages[]>(q);
    return c.json(res);
  })
  // pages list by api
  .get("/pages/api/:api", async (c) => {
    const q = /* SQL */ `SELECT * FROM pages WHERE api = ? AND deleted_at IS NULL`;
    const api = c.req.param("api");
    const res = await all<Pages[]>(q, api);
    return c.json(res);
  })
  // pages trash list by api
  .get("/pages/api/:api/trash", async (c) => {
    const q = /* SQL */ `SELECT * FROM pages WHERE api = ? AND deleted_at IS NOT NULL`;
    const api = c.req.param("api");
    const res = await all<Pages[]>(q, api);
    return c.json(res);
  })
  // pages create
  .post(
    "/pages",
    json({
      api: z.string().optional(),
      title: z.string().optional(),
      metadata: z.string().optional(),
      pathname: z.string(),
    }),
    async (c) => {
      const q = /* SQL */ `INSERT INTO pages (api, title, metadata, pathname) VALUES (?, ?, ?, ?)`;
      const { api, title, metadata, pathname } = c.req.valid("json");
      const ok = await run(q, api, title, metadata, pathname);
      return c.json({ ok });
    }
  )
  // pages update by pathname
  .patch(
    "/pages/:pathname",
    json({
      api: z.string().optional(), // @TODO FIX TO RESTRICT (NOT OPTIONAL)
      title: z.string().optional(),
      metadata: z.string().optional(),
    }),
    async (c) => {
      const q = /* SQL */ `UPDATE pages SET api = ?, title = ?, metadata = ?, updated_at = datetime("now") WHERE pathname = ?`;
      const pathname = c.req.param("pathname");
      const { api, title, metadata } = c.req.valid("json");
      const ok = await run(q, api, title, metadata, pathname);
      return c.json({ ok });
    }
  )
  // pages delete by pathname
  .delete("/pages/:pathname", async (c) => {
    const q = /* SQL */ `UPDATE pages SET deleted_at = datetime("now") WHERE pathname = ?`;
    const pathname = c.req.param("pathname");
    const ok = await run(q, pathname);
    return c.json({ ok });
  })
  // pages trash delete by pathname
  .delete("/pages/:pathname/trash", async (c) => {
    const q = /* SQL */ `DELETE FROM pages WHERE pathname = ?`;
    const pathname = c.req.param("pathname");
    const ok = await run(q, pathname);
    return c.json({ ok });
  });

export type AppType = typeof routes;

if (isServe) {
  console.log(`ready: Listening on http://localhost:3001/`);
  serve({ fetch: routes.fetch, port: 3001 });
}

export const handler = handle(app);
