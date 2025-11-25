# Deploying to Netlify

Follow these steps to deploy the Satta King website with real-time data to Netlify:

## Prerequisites
1. Create a free account at [netlify.com](https://netlify.com)
2. Prepare the website files (all files in this folder)

## Deployment Steps

### Method 1: Drag and Drop (Easiest)
1. Go to [netlify.com](https://netlify.com) and sign in
2. Drag and drop the entire folder (containing index.html and all other files) onto the deployment area
3. Netlify will automatically deploy your site
4. Wait for the deployment to complete
5. Visit your new site URL!

### Method 2: GitHub Integration
1. Push this code to a GitHub repository
2. Log in to Netlify
3. Click "New site from Git"
4. Connect your GitHub account
5. Select your repository
6. Configure the build settings:
   - Build command: `echo 'No build command needed'`
   - Publish directory: `/`
7. Click "Deploy site"

## How It Works on Netlify
- The site is served statically from Netlify's CDN
- The `/api/results` and `/api/chart` endpoints are redirected to the real satta-king-fast.com website
- The JavaScript client parses the HTML data and displays it in real-time
- Data updates every 30 seconds automatically

## Custom Domain (Optional)
1. In your Netlify dashboard, go to your site settings
2. Click "Domain Management"
3. Add your custom domain
4. Follow Netlify's DNS configuration instructions

## Notes
- No server-side code is needed - everything runs in the browser
- The real-time data fetching works through Netlify's redirect/proxy feature
- All original functionality is preserved