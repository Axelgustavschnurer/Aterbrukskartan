# STUNS maps

This project is a rewrite of a previous map project (available in the `StunsStreetMap_Archive` branch) aiming to display stories where STUNS has been involved with students from Uppsala's universities regarding their projects.

This project also contains a secondary hidden map as a demo for a project that aims to facilitate recycling of construction materials by displaying planned projects.
The idea is that companies enter some project information, like when and where they will do what, and what kinds of materials they will need or have available.

# Dev stuff

**Because of how it is written, this project won't work if certain columns in the database are empty. This includes when the entire database is empty.**

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
[React](https://reactjs.org/) is used for the frontend and [Prisma](https://www.prisma.io/) is used for the database.


To view our plans for possible future improvements, see [this document](https://stuns.sharepoint.com/:w:/s/terbrukskartan/ET3yGNnQiTNPra6jFuFIEygB-gpCZnkSEF_R-C6VWvCt6w?e=htn8uE).

---

## Getting Started

All commands are to be run in your terminal of choice, in the root directory of the project.

First, download and install [Node.js](https://nodejs.org/en/download/) and clone the repository here on Azure (preferably to [VS Code](https://code.visualstudio.com/download), but you'll need [git](https://git-scm.com/downloads) regardless of what you use).

Thereafter, install dependencies by running:

```bash
npm install
```

Then, create a `.env` file in the root directory containing the following:

```
DATABASE_URL = "sqlserver://<url>:<port>;database=<database>;user=<user>;pwd=<password>;<optional arguments>"

SHADOW_DATABASE_URL="sqlserver://localhost:1433;database=shadow;trustServerCertificate=true;integratedSecurity=true"
```

The current database url is already set up in a .env file among the secure files on azure, so if you change database you need to update the file there as well.

If you don't know the database url, try asking a project admin.
If they don't know or can't be reached, you could try contacting leon.loov@outlook.com.

If you still can't get the database url, you could theoretically get the deployment pipeline to print it out, but that's extremely bad practice and absolutely not recommended.

- Do note that the database url is a secret and should not be shared with anyone.
  - Making the pipeline print it out is a very bad idea because it will be visible to others in the logs.
- If you still want to do it, you should google how to print environment variables in Azure Pipelines. It's not hard, but it's not something I'm going to write here.

The shadow database url doesn't _need_ to be on localhost, however it shouldn't match the actual database url.

- The shadow database is used as an intermediary step when changing the database schema, and data should not be stored there.
- To create a local database, you can use [SQL Server Management Studio](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms) (SSMS).

Run prisma generate to generate the prisma client:

```bash
npx prisma generate
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (by default) to see the site.

To view the database, run the following command:

```bash
npx prisma studio
```

Then open [http://localhost:5555](http://localhost:5555) to see the data.

---

## Changing the database schema

NOTE: The following instructions are NOT best practice, we are using a dev command to change the production database schema. MAKE SURE TO DOWNLOAD A BACKUP OF THE DATABASE BEFORE MAKING ANY CHANGES. Either go [here](https://maps.stuns.se/download?demoKey=supersecreturlmaybechangeinthefuture) and download Stories-data, mapItem-data, and Recycle-data or get a proper backup somehow.

In order to change the database schema, make sure you have a shadow database url set up in your `.env` file.

Edit the file at `prisma/schema.prisma` to change the database schema.

Then, run the following command to make sure the database is valid:

```bash
npx prisma validate
```

If the database is valid, you can run the following command to create a migration:

```bash
npx prisma migrate dev --create-only
```

and follow the instructions.

Otherwise, figure out a way to fix the database.

---

## Important links

The query parameters change according to the values in `src/keys.ts`. If running on localhost, replace `maps.stuns.se` with `localhost:3000` in the links below.

- [https://maps.stuns.se](https://maps.stuns.se) - Story website.
- [https://maps.stuns.se/?stunsStoriesAdmin=hVg1JHJV787gFGftrd](https://maps.stuns.se/?stunsStoriesAdmin=hVg1JHJV787gFGftrd) - Admin page for stories.
- [https://maps.stuns.se/aterbruk?demoKey=supersecreturlmaybechangeinthefuture](https://maps.stuns.se/aterbruk?demoKey=supersecreturlmaybechangeinthefuture) - Återbrukskartan.
- [https://maps.stuns.se/aterbruk?demoKey=supersecreturlmaybechangeinthefuture&admin=yesforreal](https://maps.stuns.se/aterbruk?demoKey=supersecreturlmaybechangeinthefuture&admin=yesforreal) - Admin for återbrukskartan.
- [https://maps.stuns.se/?energiportalen=true](https://maps.stuns.se/?energiportalen=true) - Customized version of the map to be viewed within the iframes of Energiportalen.
- [https://maps.stuns.se/download](https://maps.stuns.se/download) - Page where you can download data from the database, both in current format and the old format used at dataportalen.
- [https://maps.stuns.se/download?demoKey=supersecreturlmaybechangeinthefuture](https://maps.stuns.se/download?demoKey=supersecreturlmaybechangeinthefuture) - Adding the demo key will allow you to download data for Återbrukskartan.
- [https://maps.stuns.se/download?demoKey=supersecreturlmaybechangeinthefuture&admin=yesforreal](https://maps.stuns.se/download?demoKey=supersecreturlmaybechangeinthefuture&admin=yesforreal) - Allows you to upload data for Återbrukskartan, but only if run on localhost.

### Uploading data to the database

If you want to upload recycle data to the database, you should run the project locally and use the button that shows up on the download page when both the demo key and the admin key are present in the query parameters.  
Current local link there: [http://localhost:3000/download?demoKey=supersecreturlmaybechangeinthefuture&admin=yesforreal](http://localhost:3000/download?demoKey=supersecreturlmaybechangeinthefuture&admin=yesforreal)  
There is a folder called externalData in the root directory of the project wherein you can find some example files from the first upload.  
The file called `ByggaBo.geojson` is used to convert from "Fastighetsbeteckning" to coordinates, and should not be changed unless you know what you're doing and are feeling up to the task of changing the code that uses it.  
The file called `skolfastigheter.csv` contains an example of data that can be uploaded to the database. Any file you wish to upload should be in the same format (converted from the xlsx file provided by the municipality to a csv file with utf-8 encoding). You can change the file name, but make sure to change the name in the code as well. The file name is currently set to `skolfastigheter.csv` in `src\pages\api\addRecycleFromExternal.ts` on line 64 (in the declaration of the variable `csvFile`). If you feel up for it, feel free to update the code to accept any file name or drag and drop functionality in the browser or whatever else to make it easier to upload data.

### Good to know

To change the keys/values in the url, change the values in `src/keys.ts`. If you do, please update the links above for easy access.

---

## API Routes

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
