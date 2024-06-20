# STUNS maps

This project is aims to create a platform where users can share their construction-related projects to further the goal of a circular economy.
The idea is that they post what materials they need or can provide to others, and then others can see this and contact them to get/buy the materials they need or to give away/sell materials they don't need.

# Dev stuff

**Because of how it is written, this project won't work if certain columns in the database are empty. This includes when the entire database is empty. Fixing this would be a nice improvement.**

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app), using the pages router.
Next is based on [React](https://reactjs.org/), and [Prisma](https://www.prisma.io/) is our ORM of choice, so some knowledge of these is recommended.

## Getting Started

All commands are to be run in your terminal of choice, in the root directory of the project.

First, download and install [Node.js](https://nodejs.org/en/download/) and clone this repository using [git](https://git-scm.com/downloads). We recommend using [Visual Studio Code](https://code.visualstudio.com/) as your code editor/IDE, but any editor will do.

Thereafter, install dependencies by running:

```bash
npm install
```

Then, create a `.env` file in the root directory containing the following:

```
DATABASE_URL = "sqlserver://<url>:<port>;database=<database>;user=<user>;pwd=<password>;<optional arguments>"

IRON_SESSION_PASSWORD = "<password>"
```

- Any string at least 32 characters long can be used as the iron session password. See the [iron-session GitHub page](https://github.com/vvo/iron-session) for more information.
- For development, you can create a local database using [SQL Server Management Studio](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)(SSMS), with a database connection string like `sqlserver://localhost:1433;database=aterbruk;trustServerCertificate=true;integratedSecurity=true` (with `integratedSecurity=true` you can omit the user and password fields, and it will use your Windows credentials to log in).
  - Note that you must pre-populate the database with some data for the project to work. This can be done in the interface from `npx prisma generate`.

Run prisma generate to generate the prisma client:

```bash
npx prisma generate
```

Run in development mode:

```bash
npm run dev
```

Or, if you want to build and typecheck the project before running it:

```bash
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) (by default) to see the site. *Note that it won't work if the database is empty, see the note at the top of this file.*

To view the contents of your connected database, run the following command:

```bash
npx prisma studio
```

Then open [http://localhost:5555](http://localhost:5555) if it doesn't open automatically.

## Changing the database schema

For now, this instance of the project shares its database with the [STUNS Stories map](https://github.com/STUNS-Uppsala/Stories) (a private repository deploying to [this site](https://maps.stuns.se)). This means that THIS PROJECT MAY NOT CHANGE THE UPSTREAM DATABASE SCHEMA and will be affected by any changes made to the Stories map database schema. We should aim to set up a separate database for this project in the future.

### Changing the development database schema
**Never run `prisma migrate dev` against a production database.**  
Edit the file at `prisma/schema.prisma` to change the database schema.

Then, run the following command to make sure your current database is valid:

```bash
npx prisma validate
```

If the database is valid, you can run the following command to create a migration:

```bash
npx prisma migrate dev --create-only
```

and follow the instructions.

### Changing the production database schema
**NEVER run `prisma migrate dev` against the production database.**  
Once you're done testing with the development database, you should apply the changes to the production database.
This should be done automatically by a GitHub action when you push your changes to the main branch in the future. For now, you are not allowed to update the production database schema since it is shared with the [Stories map](https://maps.stuns.se).

### Uploading data to the database

There is scuffed functionality to upload recycle data to the database, to use it you should run the project locally and use the button that shows up on the download page when logged in as an admin.  
Link to default localhost location: [http://localhost:3000/download](http://localhost:3000/download)  
There is a folder called externalData in the root directory of the project wherein you can find some example files from the first upload.  
The file called `ByggaBo.geojson` is used to convert from "Fastighetsbeteckning" to coordinates, and should not be changed unless you know what you're doing and are feeling up to the task of changing the code that uses it.  
The file called `skolfastigheter.csv` contains an example of data that can be uploaded to the database. Any file you wish to upload should be in the same format (converted from the xlsx file provided by the municipality to a csv file with utf-8 encoding). You can change the file name, but make sure to change the name in the code as well. The file name is currently set to `skolfastigheter.csv` in `src\pages\api\addRecycleFromExternal.ts` on line 64 (in the declaration of the variable `csvFile`). If you feel up for it, feel free to update the code to accept any file name or drag and drop functionality in the browser or whatever else to make it easier to upload data.

## Good to know

We store a few different values in the iron-session cookie, which are as follows:
- id - the id of the user in the database.
- email - the email of the user.
- isLoggedIn - boolean, doesn't really do anything; any user with a valid session is currently assigned this role, but checks that only need the user to be logged in check for if the user has a valid session, not that they have this specific role.
- isAdmin - boolean, if true the user can access all pages, can add and edit users, can upload certain data to the database when running the project locally, can add and edit Recycle data and enter any organisation as owner of their projects.
- isStoryteller - boolean, is a remnant from the Stories map and doesn't do anything in this project. Should be removed once we set up our own database.
- isRecycler - boolean, if true the user can add and edit Recycle data related to the organisation/-s listed in their recycleOrganisations field and can enter those organisations as owner of those projects.
- recycleOrganisations - a list of organisations that the user is allowed to enter as owner of Recycle projects. This doesn't restrict access to any pages, but it restricts which organisations the user can enter as owner of Recycle projects. If the user is not an admin, they can only enter organisations that are in this list. If the user is an admin, they can enter any organisation as owner of Recycle projects, regardless of what is in this list.

## API Routes

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

# License
Copyright (C) 2023, 2024 Leon Lööv, Axel Schnürer

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

Additional permission under GNU AGPL version 3 section 7

If you modify this Program, or any covered work, by linking or combining it with [React Leaflet](https://react-leaflet.js.org/) (or a modified version of that library), containing parts covered by the terms of the [Hippocratic License 2.1](https://firstdonoharm.dev/version/2/1/license/), the licensors of this Program grant you additional permission to convey the resulting work.