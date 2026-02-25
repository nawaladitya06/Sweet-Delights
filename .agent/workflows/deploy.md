---
description: How to deploy Sweet Delights code to GitHub
---

Follow these steps to push your changes to GitHub. This will trigger the automatic deployment to Render.

1. **Verify .gitignore**
   - Ensure your `.env` files are in the `.gitignore` so they aren't pushed to GitHub.

2. **Stage Changes**
   - Open your terminal in the project root folder.
   - Run: `git add .`

3. **Commit Changes**
   - Run: `git commit -m "Add automatic annual/monthly reports generation system"`

4. **Push to GitHub**
   - Run: `git push origin main`
   - *Note: If your main branch is named `master`, use `git push origin master` instead.*

5. **Verify on Render**
   - Head over to your Render dashboard to see the building progress.
