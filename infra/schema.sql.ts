export default /* SQL */ `

-- DROP TABLE IF EXISTS apis;
CREATE TABLE IF NOT EXISTS apis (
  api TEXT PRIMARY KEY,
  title TEXT DEFAULT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- DROP TABLE IF EXISTS blobs;
CREATE TABLE IF NOT EXISTS blobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_data BLOB NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL CHECK(file_type IN ('image/jpeg', 'image/png', 'image/svg+xml', 'application/pdf', 'text/html')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- DROP TABLE IF EXISTS forms;
CREATE TABLE IF NOT EXISTS forms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  api TEXT NOT NULL,
  form_name TEXT DEFAULT NULL,
  form_type TEXT DEFAULT NULL,
  form_title TEXT DEFAULT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (api) REFERENCES apis(api) ON DELETE RESTRICT
);

-- DROP TABLE IF EXISTS items;
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  blob_id INTEGER DEFAULT NULL,
  form_id INTEGER DEFAULT NULL,
  content TEXT DEFAULT NULL,
  pathname TEXT DEFAULT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (id) REFERENCES blobs(id) ON DELETE RESTRICT,
  FOREIGN KEY (id) REFERENCES forms(id) ON DELETE RESTRICT,
  FOREIGN KEY (id) REFERENCES pages(id) ON DELETE RESTRICT
);

-- DROP TABLE IF EXISTS pages;
CREATE TABLE IF NOT EXISTS pages (
  pathname TEXT PRIMARY KEY,
  api TEXT DEFAULT NULL,
  title TEXT DEFAULT NULL,
  metadata JSON DEFAULT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  deleted_at TEXT DEFAULT NULL,
  publish_at TEXT DEFAULT NULL,
  FOREIGN KEY (api) REFERENCES apis(api)
);
`.trim();
