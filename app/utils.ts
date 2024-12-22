export const SUPPORT_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "application/pdf",
  "text/html",
]);

export function* range(end = 1, start = 0) {
  while (start < end) yield start++;
}

export async function createBlobInput(file: File) {
  if (!file) throw new Error(`create blob Error: no such file found`);
  if (!(file instanceof File))
    throw new Error(`create blob Error: formData file is not File`);
  if (!SUPPORT_MIME_TYPES.has(file.type))
    throw new Error(`create blob Error: Unsupported file type`);
  const buffer = await file.arrayBuffer();
  const file_data = Buffer.from(buffer).toString("base64");
  const file_name = Buffer.from(file.name, "latin1").toString("utf8");
  const file_type = file.type;
  const file_size = buffer.byteLength;
  return {
    file_data,
    file_name,
    file_size,
    file_type,
  };
}
