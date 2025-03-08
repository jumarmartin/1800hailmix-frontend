# Phone Voice Messages Frontend

This project is the React frontend for the Phone Voice Messages application, bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run deploy`

Builds and deploys the app to GitHub Pages.

## GitHub Pages Configuration

This app is configured for GitHub Pages deployment. Important configuration:

1. **API URL Configuration**:
   - Development: In `.env.development` or `.env.development.local`
   - Production: Via GitHub repository secrets (preferred) or in `.env.production`

2. **Deployment Methods**:
   - **GitHub Actions** (preferred): 
     - Push to the main branch to trigger the GitHub workflow
     - Set the `REACT_APP_API_URL` secret in your GitHub repository settings
     - The workflow will use this secret during build
   
   - **Manual Deployment**: 
     - Edit `.env.production` with your backend URL
     - Run `npm run deploy` locally

3. **First-time Setup**:
   - Update the `homepage` field in `package.json` with your GitHub Pages URL
   - Set up the `REACT_APP_API_URL` secret in your GitHub repository settings

## CORS Considerations

Make sure your backend server has CORS configured to allow requests from your GitHub Pages domain:

```
Access-Control-Allow-Origin: https://your-username.github.io
```