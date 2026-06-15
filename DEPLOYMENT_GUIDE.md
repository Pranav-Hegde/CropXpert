# Crop Recommendation System: Online Deployment Guide (No Docker)

This guide provides two clean, robust pathways to deploy the Crop Recommendation System online without running into Docker network conflicts, port binding issues, or Docker configuration overhead.

---

## Preparation: Set Up MongoDB Atlas (Cloud Database)

To make the app run online, you need an online database. Setting up MongoDB Atlas (the free cloud tier) is highly recommended.

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new shared cluster (M0 Free Tier).
3. Under **Database Access**, create a user with read/write privileges.
4. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`) since cloud service IPs change dynamically.
5. In **Database/Clusters**, click **Connect** -> **Drivers** (Node.js) and copy the connection string. It will look like this:
   `mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/Crop?retryWrites=true&w=majority`
6. Keep this connection URI safe. You will use it for your Backend configuration.

---

## Option A: Managed PaaS Deployment (Render + Vercel)
*Recommended for easy maintenance, zero server overhead, automated SSL, and 100% free-tier compatibility.*

We will separate the frontend (React) and the backends (Express & Python Flask) into native serverless/PaaS environments.

### 1. One-Click Blueprint Deploy (Render)
We have provided a [render.yaml](file:///d:/Crop-Recommendor-System-main/render.yaml) blueprint file in the root of the project. This configures Render to deploy all 4 services at once automatically.

1. Commit and push the workspace changes to your GitHub repository.
2. Log in to [Render](https://render.com/).
3. Go to the **Blueprints** dashboard and click **New Blueprint Instance**.
4. Connect your GitHub repository.
5. Render will automatically detect the [render.yaml](file:///d:/Crop-Recommendor-System-main/render.yaml) file and prompt you to configure the environment:
   - **`MONGO_URI`** (under `crop-backend` variables): Paste your MongoDB Atlas Connection String (from the Preparation step).
   - Once the backends spin up, copy their public HTTPS URLs (e.g. `https://crop-backend-xxx.onrender.com`).
   - Fill in the values for the frontend's API URL environment variables:
     - `REACT_APP_BACKEND_API_URL`
     - `REACT_APP_RECOMMEND_API_URL`
     - `REACT_APP_CARBON_API_URL`
6. Click **Approve** to deploy. Render will automatically orchestrate, build, and serve all components!

---

### 2. Manual Service Deployment (Render + Vercel)
If you prefer deploying services one-by-one, or serving the frontend on Vercel:

#### Step 1: Deploy Node.js Express Backend on Render
1. Go to [Render](https://render.com/) and click **New** -> **Web Service**.
2. Connect your GitHub repository containing the project.
3. Set the following configurations:
   - **Name**: `crop-backend`
   - **Root Directory**: `Crop/Backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add the following **Environment Variables** in the "Environment" tab:
   - `PORT`: `5000`
   - `MONGO_URI`: `your_mongodb_atlas_connection_string` (from the Preparation step)
   - `JWT_SECRET`: `your_custom_jwt_secret_key`
5. Click **Deploy Web Service**. Render will generate a URL like `https://crop-backend.onrender.com`.

#### Step 2: Deploy Python Recommendation API on Render
1. Click **New** -> **Web Service** and connect your repository.
2. Set the following configurations:
   - **Name**: `crop-recommend`
   - **Root Directory**: `Crop/Recommend`
   - **Runtime**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
3. Click **Deploy Web Service**. It will generate a URL like `https://crop-recommend.onrender.com`.

#### Step 3: Deploy Python Carbon Footprint API on Render
1. Click **New** -> **Web Service** and connect your repository.
2. Set the following configurations:
   - **Name**: `crop-carbon`
   - **Root Directory**: `Crop/CarbonFootprint`
   - **Runtime**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
4. Click **Deploy Web Service**. It will generate a URL like `https://crop-carbon.onrender.com`.

#### Step 4: Deploy the Frontend on Vercel
Vercel is optimized for React builds and offers lightning-fast edge networking.
1. Go to [Vercel](https://vercel.com/) and connect your GitHub account.
2. Click **Add New** -> **Project** and select your repository.
3. Configure the build parameters:
   - **Root Directory**: `Crop/Frontend/frontend`
   - **Framework Preset**: `Create React App`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Under **Environment Variables**, add the API endpoint URLs pointing to the Render web services we created:
   - `REACT_APP_BACKEND_API_URL` = `https://crop-backend.onrender.com`
   - `REACT_APP_RECOMMEND_API_URL` = `https://crop-recommend.onrender.com`
   - `REACT_APP_CARBON_API_URL` = `https://crop-carbon.onrender.com`
5. Click **Deploy**. Vercel will build and serve your app at a public domain (e.g. `https://crop-recommendation.vercel.app`).

---

## Option B: Self-Hosted VPS Deployment (AWS, DigitalOcean, etc.)
*Best for having absolute control on a single virtual machine (like Ubuntu server) without Docker.*

We will orchestrate the backends using **PM2** and serve/proxy everything using **Nginx**.

### Step 1: Clone and Set Up the Project
SSH into your Linux VPS and run:
```bash
git clone <your-repo-url> crop-system
cd crop-system
```

### Step 2: Run the Automation script
Make the setup script executable and run it:
```bash
chmod +x deploy_setup.sh
./deploy_setup.sh
```
This script automatically:
- Installs Node.js, Python3, and Pip.
- Installs `PM2` process manager globally.
- Creates Python virtual environments (`venv`) and installs project dependencies.
- Runs all 3 backend services (`crop-backend`, `crop-recommend`, `crop-carbon`) in the background under PM2 control.
- Automatically configures them to auto-start if the VPS reboots.

### Step 3: Configure Environment Variables
You can configure the backend database URL and keys by editing the `ecosystem.config.js` file:
```bash
nano ecosystem.config.js
```
Update the `MONGO_URI` environment variable inside the `crop-backend` app block with your MongoDB Atlas URI. Apply changes with:
```bash
pm2 restart ecosystem.config.js --env production
```

### Step 4: Configure Nginx Reverse Proxy
To avoid port blocks, CORS errors, or having to open multiple ports on your firewall, we will use Nginx to serve the React frontend and proxy all API calls on standard Port 80 (HTTP).

1. Open Nginx default configuration:
   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```
2. Replace the contents with the following template (replace `/path/to/crop-system` with the absolute path of your repository, e.g. `/home/ubuntu/crop-system`):
   ```nginx
   server {
       listen 80;
       server_name your_domain_or_server_ip;

       # Serve React Static files
       location / {
           root /path/to/crop-system/Crop/Frontend/frontend/build;
           index index.html index.htm;
           try_files $uri $uri/ /index.html;
       }

       # Proxy requests to Node.js Backend API
       location /api/ {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       # Proxy requests to Python Recommendation API
       location /predict {
           proxy_pass http://localhost:5001;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }

       # Proxy requests to Python Carbon API
       location /calculate {
           proxy_pass http://localhost:5002;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   ```
3. Test and restart Nginx:
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

Now, the entire application is accessible at `http://your_domain_or_server_ip` on standard HTTP port 80!

---

## PM2 Service Cheat Sheet
Use these commands on your VPS to manage your running backend services:

- **Check status of all services**:
  ```bash
  pm2 status
  ```
- **View logs in real-time**:
  ```bash
  pm2 logs
  ```
- **View logs for a specific service**:
  ```bash
  pm2 logs crop-backend
  ```
- **Restart all services**:
  ```bash
  pm2 restart ecosystem.config.js
  ```
- **Stop all services**:
  ```bash
  pm2 stop ecosystem.config.js
  ```
