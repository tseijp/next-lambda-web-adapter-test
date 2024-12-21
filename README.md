# next-lambda-web-adapter-test

## Quick start

```ruby
git clone https://github.com/tseijp/next-lambda-web-adapter-test
cd next-lambda-web-adapter-test
sam build
sam deploy --guided
```

## Getting started

```ruby
npx create-next-app@latest --yes
cd my-app
```

### standalone mode

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

### Create 3 files

- Makefile
- run.sh
- template.yml

### Deploy to lambda

before install docker and aws sam

```ruby
sam build
sam local invoke --region ap-northeast-1
sam deploy --guided
```

### Connect to CI/CD

```ruby
echo 'samconfig.toml' >> .gitignore
echo '**/.aws-sam' >> .gitignore
echo '**/*.sqlite3' >> .gitignore
sam pipeline init --bootstrap
git add .
git commit -m ":tada: init commit"
git push
```

## deploy sqlite and hono endpoint

### init infra

```ruby
mkdir infra
cd infra
cdk --version # 2.173.1
cdk init -l typescript
```

### create 3 files

- infra/bin/infra.ts
- infra/lib/file-system-stack.ts
- infra/lib/vpc-lambda-stack.ts
- infra/lib/vpc-subnet-stack.ts

### add tempporary handler and deploy

`cdk deploy --all`

```ts
// handler.ts
export const handler = () => {
  console.log(`Hello Lambda!`);
};
```

## invoke to access vpc resource

### install 3 package to invoke

```
npm i hono sqlite @aws-sdk/client-lambda
```

### create 3 files

- infra/handler.ts
- infra/invoker.ts
- infra/schema.sql

## More

> This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
> 
> ## Getting Started
> 
> First, run the development server:
> 
> ```bash
> npm run dev
> # or
> yarn dev
> # or
> pnpm dev
> # or
> bun dev
> ```
> 
> Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
> 
> You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
> 
> This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
> 
> ## Learn More
> 
> To learn more about Next.js, take a look at the following resources:
> 
> - [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
> - [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
> 
> You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
> 
> ## Deploy on Vercel
> 
> The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
> 
> Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
