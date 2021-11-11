const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares //
app.use(cors());
app.use(express.json());

// mongoDB connection //
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3myda.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("bikez");
    const productsCollection = database.collection("products");
    const ordersCollection = database.collection("orders");
    const reviewsCollection = database.collection("reviews");
    const usersCollection = database.collection("users");
    // GET API to get all the products
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
    // GET API to get all the orders
    app.get("/orders", async (req, res) => {
      const query = { userEmail: req.query.email };
      const cursor = ordersCollection.find(query);
      const result = await cursor.toArray();
      res.json(result);
    });
    // GET API to get all the reviews
    app.get("/reviews", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
    // POST API to post orders
    app.post("/orders", async (req, res) => {
      const doc = req.body;
      const result = await ordersCollection.insertOne(doc);
      res.json(result);
    });
    // POST API to post reviews
    app.post("/reviews", async (req, res) => {
      const doc = req.body;
      const result = await reviewsCollection.insertOne(doc);
      res.json(result);
    });
    // POST API to save users
    app.post("/users", async (req, res) => {
      const doc = req.body;
      const result = await usersCollection.insertOne(doc);
      res.json(result);
    });
    // PUT API to check user for google sign in
    app.put("/users", async (req, res) => {
      const email = req.body.email;
      const query = { email: email };
      const options = { upsert: true };
      const updateDoc = { $set: req.body };
      const result = await usersCollection.updateOne(query, updateDoc, options);
      res.json(result);
    });
    // DELETE API to delete specific order
    app.delete("/orders", async (req, res) => {
      const id = req.query.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to BIKEZ websites server side !!!");
});
app.listen(port, () => {
  console.log(`listening to http://localhost:${port}`);
});
