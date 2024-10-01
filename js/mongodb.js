require('dotenv').config({ path: '.env.local' });

const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

const uri = process.env.MONGODB_URI;

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas!");
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
  }
}

app.get('/', async (req, res) => {
  // Example route to test connection
  res.send('Welcome to the website!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  connectToDatabase();
});
