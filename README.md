# terminus-group-backend

Backend for the Terminus Group platform.

## Deployment

To deploy this Node.js/Express backend on Render:

1. Create a Render account at https://render.com if you don't have one
2. Click the "New +" button and select "Web Service"
3. Connect your GitHub repository or paste the repository URL: https://github.com/prathamdby/terminus-group-backend
4. Configure the following settings:
   - Name: Choose a name for your service
   - Environment: Node
   - Region: Choose the closest region
   - Branch: master
   - Build Command: `npm ci; npm run build`
   - Start Command: `npm start`
   - Instance Type: Free (or choose paid tier for production)
5. Click "Create Web Service"

Render will automatically build and deploy your application. Once complete, you can access it at the provided .onrender.com URL.

For more details, see the [Render Node.js deployment docs](https://render.com/docs/deploy-node-express-app).
