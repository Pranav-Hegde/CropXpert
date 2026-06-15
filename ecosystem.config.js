module.exports = {
  apps: [
    {
      name: 'crop-backend',
      script: 'server.js',
      cwd: './Crop/Backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        MONGO_URI: 'mongodb+srv://pranavhegde:pranav%40123@cluster0.fos8jjm.mongodb.net/Crop?retryWrites=true&w=majority&appName=Cluster0',
        JWT_SECRET: 'yourSuperSecretKey123'
      }
    },
    {
      name: 'crop-recommend',
      script: 'app.py',
      cwd: './Crop/Recommend',
      interpreter: 'python3', // Set to 'python' or absolute path to venv (e.g. './venv/bin/python') depending on environment
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        PORT: 5001
      }
    },
    {
      name: 'crop-carbon',
      script: 'app.py',
      cwd: './Crop/CarbonFootprint',
      interpreter: 'python3', // Set to 'python' or absolute path to venv (e.g. './venv/bin/python') depending on environment
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        PORT: 5002
      }
    }
  ]
};
