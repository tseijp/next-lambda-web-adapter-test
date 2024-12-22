// infra/invoker.ts
import { Lambda } from "@aws-sdk/client-lambda";
import { hc } from "hono/client";
import {routes, type AppType } from "./handler";

const isLocal = process.env.RUNTIME_ENV === "local";

const lambda = new Lambda({
  region: process.env.VPC_LAMBDA_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.VPC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.VPC_AWS_SECRET_ACCESS_KEY!,
  },
});

const customFetch = async (path: RequestInfo | URL, init?: RequestInit) => {
  const { body, method, headers } = init ?? {};
  const payload = {
    path,
    body,
    httpMethod: method,
    headers: Object.fromEntries(headers as []),
    isBase64Encoded: false,
  };

  const args = {
    FunctionName: process.env.VPC_LAMBDA_FUNCTION_NAME,
    Payload: JSON.stringify(payload),
  };

  const res = await lambda.invoke(args);
  const buf = Buffer.from(res.Payload!);
  const obj = JSON.parse(buf.toString());
  return new Response(obj.body);
};

export const invoker = () => {
  if (isLocal)
    return hc<AppType>("http://localhost:3001");
  return hc<AppType>("", { fetch: customFetch });
}
