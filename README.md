# grouple

## Description

Grouple-Assessment is a booking management system API. The API is built using Node.js with Express.js for the backend, and it utilizes MySQL as the database.

The project implements role-based access control, distinguishing between admin users with full access and regular login users who can perform limited actions. Authentication is handled using JSON Web Tokens (JWT). Users can create bookings with user information, desired number of users, start and end times. The API allows updates to existing bookings, retrieval of a single booking by its ID, and retrieval of all bookings with pagination and sorting capabilities. It also enforces a maximum user count per booking through a configurable environment variable.

# Steps to run the Project

## Step1 --> Clone the repository:

```bash
git clone https://github.com/Abubakarask/grouple
```

PS: Unzip the file if you have zipped folder of the project.

## Step2 --> Get(Retrieve) Files which are not present in zipped folder/repository

### i)node_modules --> Use `npm i` (to install required libraries)

### ii).env --> fill the environment variables values from file named .env (in main folder) with attributes:

                          - PORT
                          - DB_HOST
                          - DB_USERNAME
                          - DB_PASS
                          - DB_NAME
                          - JWT_SECRET
                          - MAX_BOOKING

### iii) Add tables in your sql server/workbench

    These are few options to add tables in sql server/workbench:
     - Option 1: Import the SQL dumps in mysql to create and add mock data in your db.
     - Option 2: Uncomment Line 21 - 28 from db.sequelize.js and start the server to migrate and create tables automatically.
     - Option 3:
        - Install Sequelize CLI:
            ```npm install --save-dev sequelize-cli```
        - Configure Sequelize:
                Setup file config/config.json your your db server attributes.
        - Create Migrations:
                Run the following command to create migration files based on your Sequelize models:
                ```npx sequelize-cli db:migrate:status```
        - Execute Migrations:
                To apply these migrations and create the corresponding tables in your MySQL database, run the following command:
                ```npx sequelize-cli db:migrate```

### iv) Import Postman from folder Postman to get(test) all the APIs.

## Step3: Start Project

### Start the project with `npm run dev`.

## Task2: Real Time Communication
This project can be extended to include real-time communication between users and admins. To test this functionality, open the following URLs in separate browser tabs:

- User Interface: http://localhost:3600/user/
- Admin Interface: http://localhost:3600/admin/

Note: Make sure to replace http://localhost:3600 with the actual URL if it's different in your setup. Also change the url in [line-13] of public/admin/index.js
