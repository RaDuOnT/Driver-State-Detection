# React Node MongoDB Authentication App

## Overview

This project is a simple web application built with React, Node.js, and MongoDB. The app allows users to sign in and view data protected by authentication.

## Features

- **User Authentication:** Secure user authentication system to protect sensitive data.
- **React Frontend:** Intuitive and responsive user interface built with React.
- **Node.js Backend:** Robust backend server using Node.js to handle authentication and data retrieval.
- **MongoDB Database:** Data storage and retrieval powered by MongoDB, ensuring scalability and flexibility.

## Prerequisites

Before running the application, make sure you have the following installed:

- Docker: [Download and Install Docker](https://www.docker.com/)

## Getting Started

1. Clone the repository:

   ```bash
   git clone git@github.com:MindruAndrei/auth-app.git

2. Run the app in a docker container
    navigate to auchanapp directory
    ```bash
    docker compose up --build

3. Check the app on localhost:80  
   - Initial page will be the authentication form  
   - Login credentials: andrei@email.com/pass@andrei  
   - After login, you will be redirected to the home page where you have some weather data displayed  
   - You will have the option of logging out