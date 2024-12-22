export const FORM_TYPES = [
  { type: "text" as const, title: "テキストフィールド" },
  { type: "textarea" as const, title: "テキストエリア" },
  { type: "editor" as const, title: "リッチエディタ" },
  { type: "blob" as const, title: "画像" },
  { type: "blobs" as const, title: "複数画像" },
  { type: "date" as const, title: "日時" },
  { type: "bool" as const, title: "真偽地" },
  { type: "select" as const, title: "セレクトフィールド" },
  { type: "ref" as const, title: "コンテンツ参照" },
  { type: "refs" as const, title: "複数コンテンツ参照" },
  { type: "number" as const, title: "数値" },
];

export type FormTypes = (typeof FORM_TYPES)[number];

export interface Apis {
  api: string;
  title?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Blobs {
  id: number;
  file_data: string;
  file_name: string;
  file_type: string;
  created_at?: string;
  updated_at?: string;
}

export interface Forms {
  id: number;
  api: string;
  form_name?: string | null;
  form_type?: FormType | null;
  form_title?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Items {
  id: number;
  pathname?: string | null;
  blob_id?: number | null;
  form_id?: number | null;
  content?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Pages {
  pathname: string;
  api?: string | null;
  title?: string | null;
  metadata?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  publish_at?: string;
}
