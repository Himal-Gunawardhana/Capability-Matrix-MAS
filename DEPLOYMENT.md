# GitHub Pages Deployment Setup

Your 3 Month Capability Matrix is now configured for GitHub Pages hosting! 🎉

## What I've Done

1. **Created GitHub Actions Workflow** (`.github/workflows/deploy.yml`)
   - Automatically builds your React app on every push to main branch
   - Deploys the built files to GitHub Pages
   - Uses the latest GitHub Actions for optimal performance

2. **Updated package.json**
   - Added homepage field pointing to your GitHub Pages URL
   - This ensures the app works correctly when hosted

## Next Steps (You Need to Do This)

### 1. Enable GitHub Pages in Your Repository

1. Go to your GitHub repository: https://github.com/Himal-Gunawardhana/Capability-Matrix-MAS
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Click **Save**

### 2. Wait for Deployment

- The GitHub Action should automatically start running after you enable Pages
- You can monitor the progress in the **Actions** tab of your repository
- First deployment usually takes 2-5 minutes

### 3. Access Your Live Site

Once deployed, your site will be available at:
**https://Himal-Gunawardhana.github.io/Capability-Matrix-MAS/**

## Automatic Updates

From now on, every time you push changes to the `main` branch:
1. GitHub Actions will automatically build your app
2. Deploy the updated version to GitHub Pages
3. Your live site will be updated within minutes

## Troubleshooting

If the deployment fails:
1. Check the **Actions** tab in your GitHub repository
2. Look for any error messages in the workflow logs
3. Common issues:
   - Repository not public (GitHub Pages requires public repos for free tier)
   - Pages not enabled in repository settings
   - Build errors in the React app

## Custom Domain (Optional)

If you want to use a custom domain:
1. Add a `CNAME` file to your `public/` folder with your domain name
2. Configure your domain's DNS to point to GitHub Pages
3. Update the homepage in package.json to your custom domain

Your React app is now ready for the world! 🚀