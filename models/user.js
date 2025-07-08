const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = async function (product) {
  try {
    let updatedCart;
    let newQty = 1;

    const prodIndex = this.cart.items.findIndex(
      (item) => item.productId.toString() === product._id.toString()
    );

    updatedCart = { ...this.cart };

    if (prodIndex >= 0) {
      newQty = this.cart.items[prodIndex].quantity + newQty;
      updatedCart.items[prodIndex].quantity = newQty;
    } else {
      updatedCart.items.push({
        productId: product._id,
        quantity: newQty,
      });
    }

    this.cart = updatedCart;
    await this.save();
  } catch (err) {
    console.log(err);
  }
};

userSchema.methods.deleteProductCart = async function (prodId) {
  try {
    let updatedCartItems = [...this.cart.items];
    updatedCartItems = updatedCartItems.filter(
      (i) => i.productId.toString() !== prodId.toString()
    );

    this.cart.items = updatedCartItems;

    await this.save();
  } catch (err) {
    console.log(err);
  }
};

userSchema.methods.clearCart = async function () {
  this.cart.items = [];
  await this.save();
};

module.exports = mongoose.model("User", userSchema);

/*
const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class User {
  constructor(userName, email, cart, id) {
    this.name = userName;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  async save() {
    try {
      const db = getDb();
      await db.collection("users").insertOne(this);
    } catch (err) {
      console.log(err);
    }
  }

  async addToCart(product) {
    try {
      let updatedCart;
      let newQty = 1;

      console.log(this.cart.items[0].productId);

      const prodIndex = this.cart.items.findIndex(
        (item) => item.productId.toString() === product._id.toString()
      );

      console.log(prodIndex);
      updatedCart = { ...this.cart };

      if (prodIndex >= 0) {
        newQty = this.cart.items[prodIndex].quantity + newQty;
        updatedCart.items[prodIndex].quantity = newQty;
      } else {
        updatedCart.items.push({
          productId: new mongodb.ObjectId(product._id),
          quantity: newQty,
        });
      }
      console.log(updatedCart);
      const db = getDb();
      await db
        .collection("users")
        .updateOne(
          { _id: new mongodb.ObjectId(this._id) },
          { $set: { cart: updatedCart } }
        );
    } catch (err) {
      console.log(err);
    }
  }

  static async findById(userId) {
    try {
      const db = getDb();
      const user = await db
        .collection("users")
        .findOne({ _id: new mongodb.ObjectId(userId) });

      return user;
    } catch (err) {
      console.log(err);
    }
  }

  async getCart() {
    try {
      const db = getDb();
      const prodIds = this.cart.items.map((i) => i.productId);
      let products = await db
        .collection("products")
        .find({ _id: { $in: prodIds } })
        .toArray();

      products = products.map((p) => {
        return {
          ...p,
          quantity: this.cart.items.find(
            (i) => i.productId.toString() === p._id.toString()
          ).quantity,
        };
      });

      return products;
    } catch (err) {
      console.log(err);
    }
  }

  async deleteProductCart(prodId) {
    try {
      const db = getDb();
      let updatedCartItems = [...this.cart.items];
      updatedCartItems = updatedCartItems.filter(
        (i) => i.productId.toString() !== prodId.toString()
      );

      await db
        .collection("users")
        .updateOne(
          { _id: new mongodb.ObjectId(this._id) },
          { $set: { cart: { items: updatedCartItems } } }
        );
    } catch (err) {
      console.log(err);
    }
  }

  async createOrder() {
    try {
      const db = getDb();
      let products = await this.getCart();
      const order = {
        items: products,
        user: {
          _id: this._id,
          name: this.name,
        },
      };
      await db.collection("orders").insertOne(order);
      await db
        .collection("users")
        .updateOne(
          { _id: new mongodb.ObjectId(this._id) },
          { $set: { cart: { items: [] } } }
        );
    } catch (err) {
      console.log(err);
    }
  }

  async getOrders() {
    try {
      const db = getDb();
      const orders = await db
        .collection("orders")
        .find({ "user._id": new mongodb.ObjectId(this._id) })
        .toArray();
      console.log(orders);

      return orders;
    } catch (err) {
      console.log(err);
    }
  }
}


*/
