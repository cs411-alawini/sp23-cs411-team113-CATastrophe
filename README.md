# sp23-cs411-team113-CATastrophe

# Workflow:
1. **switch to your branch and fetch+merge to update your branch** \
`git checkout [your_branch]` \
`git fetch origin` \
`git merge origin/main`

2. **backend setup and run** \
`cd server` \
`npm i` \
`npm run start` or `nodemon run start`

3. **frontend setup and run** \
open another terminal in vscode and run: (2 servers need to run at the same time) \
`cd frontend-vite` \
`npm i` \
`npx vite dev` 


4. **coding time!**


5. **how to push after code is ready** \
cd to the project root directory \
`git add .` \
`git commit -m"your commit message"` \
`git push` // push to your own remote branch \
`git push origin [your_branch]:main` // push from your branch to main

# Cloud resource management:
make sure the SQL database "college-rec" is running. \


# Developing, Deployment:
for **frontend**, look into `package.json`'s "scripts" section, where you can run each command using `npm run [command_name]` (left side is the command's name/label, right side is command). 

(in frontend-vite) run `npm run dev` to have a temporary frontend for **development** that keeps updating when you edit your code. Dev backend route is stored in `.env.development`

run `npm run build` to compile and build the frontend for **production** (deploy). It will produce a `dist` folder on root that can be deployed to a hosting service, but for now we will just run it locally, with an online backend. Production backend route is stored in `.env.development`. Then run `npm run preview` to preview it stably. 


use `${import.meta.env.VITE_API_BASE_URL}` to fetch information from API, as defined in .env.development and .env.production, so that the frontend works no matter if the backend is running locally or on GCP. 

for **backend**, [to be written]

# Important dev info:






