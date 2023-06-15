# Stuntcare Backend

This is the backend code for the Stuntcare application. It provides API endpoints for managing users and related functionality.

## Create Database MySQL on Compute Engine
1) Create VM Instance with Debian OS
2) Open the SSH VM Instance
  ```
  # Installation MySQL and Configuration
    sudo apt update
    sudo apt install  mariadb-server
    sudo mysql_secure_installation
    sudo mysql -u root
    CREATE USER 'stuntcare'@'%' IDENTIFIED BY 'stuntcare';
    GRANT ALL PRIVILEGES ON *.* TO 'stuntcare'@'%';
    FLUSH PRIVILEGES;
    CREATE DATABASE stuntcare
    
  # Open Firewall 
    1. Go to firewall, edit default-allow-http :
      - Set target to All instances in this network
      - Set Source IPv4 ranges to 0.0.0.0/0
      - set TCP to 80,3306
    2. save the configuration
  ```
## Deploy to App Engine
  ```
   1. Clone repository
      $ git clone
      
   2. Change directory to app
      $ cd stuntcare-backend
      
   3. Create .env file
        ACCESS_TOKEN_SECRET = your_secret_key
        # DB CONFIGURATION  
        DB_URL = "your database host"
        DB_TABLE = "your database table"
        DB_USERNAME = "your database username"
        DB_PASSWORD = "your database password"
    
   4. Install the dependencies in node_modules folder
        npm install
  
   5. Deploy to Google Cloud App Engine
        gcloud init
        gcloud app deploy
  ```
  
## Documentation Postman
You can view the documentation postman in [here](https://documenter.getpostman.com/view/27540300/2s93sc5DDz)
