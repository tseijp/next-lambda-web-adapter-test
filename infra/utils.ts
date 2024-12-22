import { db } from "./handler";

export async function all<T>(query: string, ...args: any[]) {
  return new Promise<T>((resolve, reject) => {
    db.all(query, args, function (err, rows) {
      if (err) return reject(err);
      else resolve(rows as T);
    });
  });
}

export async function one<T>(q: string, ...args: any[]) {
  return new Promise<T>((resolve, reject) => {
    db.get(q, args, function (err, rows) {
      if (err) return reject(err);
      else resolve(rows as T);
    });
  });
}

export async function run(q: string, ...args: any[]): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run(q, args, function (err) {
      if (err) return reject(err);
      else resolve(this.lastID);
    });
  });
}

export async function fileArgs(file: File) {
  const buffer = await file.arrayBuffer();
  const file_data = Buffer.from(buffer).toString("base64");
  const file_name = Buffer.from(file.name, "latin1").toString("utf8");
  const file_type = file.type;
  const file_size = buffer.byteLength;
  return [file_data, file_name, file_size, file_type] as const;
}
