# Stuntcare Backend

This is the backend code for the Stuntcare application. It provides API endpoints for managing users and related functionality.

## Installation

1. Clone the repository :

  ```
  git clone https://github.com/C23-PS263-STUNT-CARE/stuntcare-backend.git
  ```
   
2. Navigate to the project directory :

  ```
  cd stuntcare-backend
  ```
  
3. Install the dependencies :

  ```
  npm install
  ```
4. Run the database migrations :

  ```
  npx prisma migrate dev --preview-feature
  ```
5. Set up the environment variables :

 - Create a new .env file in the root directory.
 - Add the following environment variables to the file :
 ``` 
 PORT = your_port
 
 DATABASE_URL = your_database_url
 
 ACCESS_TOKEN_SECRET = your_jwt_secret
 ```
 
 6. Start the server : 
 
  ```
  npm start
  ```
