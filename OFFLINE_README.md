# Offline Project Setup & Verification

This project (**Crop Recommendation System**) consists of multiple modules (Frontend, Backend, Recommendation Engine) that need to be prepared before running offline.

## 1. Automated Check

We have provided a PowerShell script to automatically check if your environment is ready.

1. Open PowerShell in this directory.
2. Run:
   ```powershell
   .\check_offline_ready.ps1
   ```
3. **Green "OK"** means the module is ready. 
4. **Red "MISSING"** means you need to install dependencies.
5. **Yellow warnings** indicate potential external links (CDNs, APIs) that might fail offline.

## 2. Manual Setup Instructions

If you are currently **ONLINE**, run these commands to prepare for offline usage. Once these are run, you can go offline.

### Frontend (React)
```bash
cd Crop/Frontend/frontend
npm install
```

### Backend (Node/Express)
```bash
cd Crop/Backend
npm install
```

### Recommendation Engine (Node + Python)
```bash
cd Crop/Recommend
npm install
# Ensure you have Python installed and required libraries
# If using a venv used by the app:
# python -m venv venv
# .\venv\Scripts\activate
pip install -r ../requirements.txt
```

### Database (MongoDB)
- **Requirement**: You MUST have MongoDB Community Server installed and running locally.
- **Connection**: The app is configured to connect to `mongodb://127.0.0.1:27017/Crop`.
- **Cloud Note**: Cloud MongoDB (Atlas) will NOT work offline. We have updated the configuration to use Local MongoDB.

### Carbon Footprint (Python)
```bash
cd Crop/CarbonFootprint
# Install dependencies if not already done
pip install -r ../requirements.txt
```

## 3. Troubleshooting Offline Issues

If the app fails to load when offline:

- **Missing npm modules**: Did you run `npm install` in ALL 3 folders (Frontend, Backend, Recommend)?
- **Missing Python modules**: Did you install `flask`, `numpy`, `pandas`, `scikit-learn`?
- **White screen / Broken UI**: The script `check_offline_ready.ps1` highlights files with external links. Check those files for CDN links (Bootstrap, Google Fonts) and download them locally if needed.
