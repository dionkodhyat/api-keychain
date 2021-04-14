# API

### Introduction

This is the secret key management/verification system API which allows users to create generate, verify and refresh secret keys. The tech stack that I used for the back-end were:

- Node.js
- Express.js
- MongoDB

Each key are hashed in the same manner as a JSON Web Token where the information was stored and encrypted using the HMAC algorithm. I utilized JSON Web Token methods because it was useful for authorization and exchanging information securely. The database is hosted live on the MongoDB Atlas.

### Steps to run the program

Use the command line to go to the root folder of the API 

OR

Open the zip file and click the unzipped `noise-digital` file. Then proceed to click to the `noise-digital-key-api` folder. Click the file path at the top, copy the path and open the terminal and type `cd` before pasting the file path.

`npm i`

`npm i mongoose`

`nodemon index.js`

This should run the server and establish a connection to the databse. The default port is <u>9001</u>.  You can use software such as Postman to test the API calls in the back-end, or use the user interface client.

### Closing Thoughts
