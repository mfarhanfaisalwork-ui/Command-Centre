# Deploy guide (no coding experience needed)

This walks you through getting the dashboard live at a real URL you can open on your phone.

## Part 1 — Turn on Firestore for your Firebase project

1. Go to https://console.firebase.google.com and open your **farhan-command-center** project.
2. In the left sidebar, click **Build → Firestore Database**.
3. Click **Create database**. Choose a location close to you, and select **Start in production mode**. Click **Enable**.
4. Once it's created, click the **Rules** tab at the top.
5. Delete what's there and paste this in:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

6. Click **Publish**.

   This step is required — without it, the app will load but nothing will save.

## Part 2 — Upload the code to GitHub

1. Go to https://github.com and log in (or create a free account).
2. Click the **+** icon top-right → **New repository**.
3. Name it something like `command-center`. Keep it **Private** if you'd like (your Firebase config being visible isn't a security risk for this setup, but private is fine too). Click **Create repository**.
4. On the next page, click **uploading an existing file** (a link in the middle of the page).
5. Open the folder I gave you on your computer, select **all the files and folders inside it** (not the outer folder itself — you want `src`, `package.json`, `index.html`, etc. to appear at the top level of the repo), and drag them into the browser upload area.
   - Make sure the `src` folder, `index.html`, `package.json`, `vite.config.js`, and `.gitignore` all show up in the upload list.
6. Scroll down and click **Commit changes**.

## Part 3 — Connect GitHub to Vercel and deploy

1. Go to https://vercel.com and log in (choose **Continue with GitHub** — it's the easiest option and lets Vercel see your repos).
2. Click **Add New… → Project**.
3. Find your `command-center` repo in the list and click **Import**.
4. Vercel will auto-detect this as a **Vite** project. You shouldn't need to change any settings — leave:
   - Framework Preset: **Vite**
   - Build Command: `vite build` (default)
   - Output Directory: `dist` (default)
5. Click **Deploy**.
6. Wait about a minute. When it's done, click **Visit** — that's your live dashboard URL (something like `command-center-yourname.vercel.app`).
7. Bookmark that URL / save it to your phone's home screen for quick access.

## Making changes later

Any time you want to tweak something:
- Edit the file directly on GitHub (click the file, click the pencil icon, edit, commit).
- Vercel automatically redeploys within about a minute of any commit to the repo — no extra steps needed.

## If something doesn't work

- **Page loads but adding a task does nothing / spins forever**: double-check Part 1 — the Firestore rules most likely weren't published.
- **Blank white page on Vercel**: check the **Deployments** tab in Vercel and click the failed deployment to see the error log — it's almost always a file that didn't get uploaded to GitHub correctly.
- **"Firebase: Error (auth/...)"**: this app doesn't use auth, so this shouldn't happen — if it does, double check `src/firebase.js` uploaded correctly and matches the config you gave me.
