#!/bin/bash
# deploy_setup.sh
# Automates setting up environment and starting the application on an Ubuntu server without Docker.

set -e

echo "========================================================="
echo "  CROP RECOMMENDATION SYSTEM - DEPLOYMENT SETUP SCRIPT   "
echo "========================================================="

# 1. Update package list
echo "--> Updating system packages..."
sudo apt-get update -y

# 2. Install Git, Curl, Python3, pip, venv
echo "--> Installing Git, Curl, Python3, and Pip..."
sudo apt-get install -y git curl python3 python3-pip python3-venv

# 3. Install Node.js & npm (Node 18 LTS)
if ! command -v node &> /dev/null; then
    echo "--> Node.js not found. Installing Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "--> Node.js already installed: $(node -v)"
fi

# 4. Install PM2 globally
if ! command -v pm2 &> /dev/null; then
    echo "--> Installing PM2 globally..."
    sudo npm install -g pm2
else
    echo "--> PM2 already installed."
fi

# 5. Install Backend dependencies
echo "--> Installing Backend Node.js dependencies..."
cd Crop/Backend
npm install --production
cd ../..

# 6. Install Recommend dependencies (Python venv + pip)
echo "--> Setting up Recommend Python environment..."
cd Crop/Recommend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ../..

# 7. Install CarbonFootprint dependencies (Python venv + pip)
echo "--> Setting up CarbonFootprint Python environment..."
cd Crop/CarbonFootprint
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ../..

# 8. Configure PM2 for Python virtual environments
# Update ecosystem config interpreter to use the local venv python binary we just created
echo "--> Configuring ecosystem.config.js for local virtual environments..."
sed -i "s|interpreter: 'python3'|interpreter: './venv/bin/python'|g" ecosystem.config.js

# 9. Start Services via PM2
echo "--> Starting backend services via PM2..."
pm2 start ecosystem.config.js

# 10. Save PM2 state and configure startup
echo "--> Setting up PM2 startup hook..."
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME

# 11. Install and Build Frontend dependencies
echo "--> Installing Frontend React dependencies..."
cd Crop/Frontend/frontend
npm install

echo "--> Note: Building React frontend. If deploying to a public domain,"
echo "    make sure you configure environment variables (e.g. REACT_APP_BACKEND_API_URL)"
echo "    before building. Defaulting to localhost ports."
npm run build
cd ../..

echo "========================================================="
echo "  Setup Completed Successfully!"
echo "  Express Backend: http://localhost:5000"
echo "  Recommend Python API: http://localhost:5001"
echo "  Carbon Footprint API: http://localhost:5002"
echo "  Built React Static Files inside: Crop/Frontend/frontend/build"
echo "  Use PM2 commands like 'pm2 list' or 'pm2 logs' to manage."
echo "========================================================="
