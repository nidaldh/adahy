# Enable GitHub Pages for Your Repository

## Automatic Method (if you have GitHub CLI)

If you have `gh` CLI installed, run:
```bash
gh repo edit --enable-pages --pages-source github-actions
```

## Manual Method

1. **Go to Repository Settings**
   - Visit: https://github.com/nidaldh/adahy
   - Click the **"Settings"** tab

2. **Navigate to Pages**
   - In the left sidebar, find **"Pages"** under "Code and automation"

3. **Configure Source**
   - Under **"Source"**, select **"GitHub Actions"**
   - NOT "Deploy from a branch"

4. **Save Configuration**
   - The page should automatically save
   - You'll see a message like "Your site is ready to be published at https://nidaldh.github.io/adahy/"

## Verification

After enabling Pages:
1. Go to the **Actions** tab in your repository
2. The workflow should complete successfully
3. Your app will be live at: https://nidaldh.github.io/adahy/

## Troubleshooting

If the deployment still fails:
1. Check that the repository is public (GitHub Pages requires public repos for free accounts)
2. Verify the workflow has the correct permissions
3. Make sure you selected "GitHub Actions" as the source, not "Deploy from a branch"
