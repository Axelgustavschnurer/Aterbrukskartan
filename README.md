# Återbrukskartan

This project aims to facilitate recycling of construction materials by displaying planned projects on a map.
The idea is that companies enter some project information, like when and where they will do what, and what kinds of materials they will need or have available.

# Dev stuff

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

___
## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

Then, create a `.env` file in the root directory containing the following:

```
DATABASE_URL = "sqlserver://<url>:<port>;database=<database>;user=<user>;pwd=<password>;<optional arguments>"

SHADOW_DATABASE_URL="sqlserver://localhost:1433;database=shadow;trustServerCertificate=true;integratedSecurity=true"
```

The shadow database url doesn't need to be on localhost, however it shouldn't match the actual database url.

Run prisma generate to generate the prisma client:

```
npx prisma generate
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the site.

To view the database, run the following command:

```bash
npx prisma studio
```

Then open [http://localhost:5555](http://localhost:5555) with your browser to see the database. 

___
## Important links
- [http://localhost:3000](http://localhost:3000) - Story website.
- [http://localhost:3000/?admin=yesforreal](http://localhost:3000http://localhost:3000/?admin=yesforreal) - Admin page for stories
- [http://localhost:3000/aterbruk?demoKey=supersecreturlmaybechangeinthefuture](http://localhost:3000/aterbruk?demoKey=supersecreturlmaybechangeinthefuture) - Återbrukskartan 
- [http://localhost:3000/aterbruk?demoKey=supersecreturlmaybechangeinthefuture&admin=yesforreal](http://localhost:3000/aterbruk?demoKey=supersecreturlmaybechangeinthefuture&admin=yesforreal) - Admin for återbrukskartan.

### Good to know
To change the keys in the url if necessary, change the values in `src/keys.ts`. 
___
## API Routes

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

___
## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
___
## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
___
## Whats next?
- 