# Command Center

A single-page dashboard to track NIFAR and Nifarise: task boards, social stats, and a countdown to Dec 31, 2026.

## Local development

```
npm install
npm run dev
```

## One important setup step: Firestore security rules

By default, a brand-new Firestore database is locked down and nothing can read or write to it. Since this app has no login, you need to open up read/write access.

In the Firebase console, go to **Firestore Database → Rules** and use:

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

This makes your database publicly readable/writable by anyone who has your config (which is visible in any deployed frontend anyway). That's fine for a single-user personal tool, but don't put sensitive data in it. If you add Firebase Auth later, tighten this to `if request.auth != null`.

See `DEPLOY_GUIDE.md` for full step-by-step deployment instructions.
