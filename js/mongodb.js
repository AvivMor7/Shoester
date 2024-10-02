require('dotenv').config({ path: '.env.local' }); // Load environment variables

const express = require('express'); // Load express
const { MongoClient, ServerApiVersion } = require('mongodb'); // Load MongoDB

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("Error: MONGODB_URI is not defined. Please check your .env.local file.");
  process.exit(1); // Exit the process if the URI is not set
}

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Example MongoDB connection logic
async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Ping to confirm a successful connection
    await client.db("store").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error(err);
  } finally {
    // Close the connection
    await client.close();
  }
}

// Call the run function
run().catch(console.dir);
