# Writing on deveshgautam.com

This site is edited through Pages CMS so you can publish a blog post every day without touching code.

## One-time setup

1. Create a free GitHub account at github.com and a private repository named `deveshgautam-com`.
2. In the project folder run:
   ```
   export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
   git remote add origin <repo-url>
   git branch -M main
   git push -u origin main
   ```
3. Open https://app.pagescms.org, click "Sign in with GitHub", install the Pages CMS GitHub App and grant it access to ONLY the `deveshgautam-com` repository.
4. Open the repository in Pages CMS. You will see Blog posts, Projects, Gallery, About page, Links page, and Site settings.

## Every day

1. In Pages CMS, go to Blog posts → New.
2. Fill in Title, Description (one clear sentence shown on cards and in Google), Publish date (today by default), Category, and Tags.
3. Upload a Hero image (webp or jpg, under 300 KB).
4. Write the post in Content. Use H2 headings so the table of contents appears.
5. Click Save. Saving commits to GitHub; Cloudflare rebuilds and the post is live in about 1 to 2 minutes.
6. Tick "Draft" to keep a post hidden; untick and save to publish.
7. To edit or delete a post, open it from the list.

## Tips

- Upload images as .webp or .jpg under 300 KB.
- Write the Description as one clear sentence.
- Use H2 headings in the content so the table of contents appears.

## Fallback if the CMS is down

Edit the `.md` file directly on github.com (press "." on the repo page for the web editor). The same rebuild happens.
