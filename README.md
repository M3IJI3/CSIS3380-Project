# Expense Tracker

A web application to track expenses with features such as uploading receipts, expense categorization, and more.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB

## Installation

### Backend

1. Clone the repository
    ```bash
    git clone https://github.com/yourusername/expense-tracker.git
    cd expense-tracker/server
    ```

2. Install dependencies
    ```bash
    npm install
    ```

3. Create a `.env` file in the `server` directory and add the following environment variables:
    ```
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

### Frontend

1. Navigate to the `client` directory
    ```bash
    cd ../client
    ```

2. Install dependencies
    ```bash
    npm install
    ```

## Running the Project

### Backend

1. Start the MongoDB server if it's not already running:
    ```bash
    mongod
    ```

2. Run the backend server
    ```bash
    npm start
    ```

### Frontend

1. Start the frontend development server
    ```bash
    npm start
    ```

2. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Register a new account or log in with existing credentials.
2. Add new expenses manually or upload a receipt to extract expense details.
3. View and manage your expenses in the dashboard.

## API Endpoints

### Authentication

- **POST** `/api/register`
  - Request body: `{ "username": "example", "email": "example@example.com", "password": "password123" }`
  - Response: `200 OK`, `User object`

- **POST** `/api/login`
  - Request body: `{ "email": "example@example.com", "password": "password123" }`
  - Response: `200 OK`, `{ "token": "jwt_token", "user": { "username": "example" } }`

### Expenses

- **POST** `/api/expenses`
  - Headers: `Authorization: Bearer <token>`
  - Request body: `{ "date": "2023-01-01", "expenseType": "groceries", "moneySpent": 100 }`
  - Response: `201 Created`, `Expense object`

- **GET** `/api/gettotalbills`
  - Headers: `Authorization: Bearer <token>`
  - Response: `200 OK`, `[ { "date": "2023-01-01", "expenseType": "groceries", "moneySpent": 100 } ]`

## Folder Structure



