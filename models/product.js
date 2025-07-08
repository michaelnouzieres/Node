const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

/*
const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class Product {
  constructor(title, price, description, imgUrl, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imgUrl = imgUrl;
    this.userId = userId;
  }

  async save() {
    const db = getDb();
    await db.collection("products").insertOne(this);
  }

  static async fetchAll() {
    try {
      const db = getDb();
      const products = await db.collection("products").find().toArray();
      return products;
    } catch (err) {
      console.log(err);
    }
  }

  static async findById(prodId) {
    try {
      const db = getDb();
      const product = await db
        .collection("products")
        .findOne({ _id: new mongodb.ObjectId(prodId) });
      return product;
    } catch (err) {
      console.log(err);
    }
  }

  static async updateProduct(prodId, title, price, description, imgUrl) {
    try {
      const db = getDb();
      const product = await db.collection("products").updateOne(
        { _id: new mongodb.ObjectId(prodId) },
        {
          $set: {
            title: title,
            price: price,
            description: description,
            imgUrl: imgUrl,
          },
        }
      );
      return product;
    } catch (err) {
      console.log(err);
    }
  }

  static async deleteProduct(prodID) {
    try {
      const db = getDb();
      const products = await db
        .collection("products")
        .deleteOne({ _id: new mongodb.ObjectId(prodID) });
      console.log(products);
    } catch (err) {
      console.log(err);
    }
  }
}

*/

module.exports = mongoose.model("Product", productSchema);
