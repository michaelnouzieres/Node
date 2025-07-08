const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.render("shop/product-list", {
      prods: products,
      docTitle: "Shop",
      path: "/",
      hasProducts: products.length > 0,
      layout: false,
      isAuth: req.session.isLoggedIn,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render("shop/product-list", {
      prods: products,
      docTitle: "Shop",
      path: "/",
      hasProducts: products.length > 0,
      layout: false,
      isAuth: req.session.isLoggedIn,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    const product = await Product.findById(prodId);
    await req.user.addToCart(product);

    /*
    const cart = await req.user.getCart();
    const fetchedProduct = await cart.getProducts({ where: { id: prodId } });
    if (fetchedProduct.length > 0) {
      product = fetchedProduct[0];

      const oldQty = product.cartItem.quantity;
      newQty = oldQty + 1;
    } else {
      newQty = 1;
      product = await Product.findByPk(prodId);
    }
    await cart.addProduct(product, { through: { quantity: newQty } });*/
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.items.productId");
    console.log(user.cart.items);
    res.render("shop/cart", {
      docTitle: "Your Cart",
      products: user.cart.items,
      isAuth: req.session.isLoggedIn,
    });
  } catch (err) {
    console.log(err);
  }
  /*req.user
    .getCart()
    .then((cart) =>
      cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            docTitle: "Your Cart",
            products: products,
          });
        })
        .catch((err) => console.log(err))
    )
    .catch((err) => console.log(err));
  /*Cart.getProductsInCart((cart) => {
    res.render("shop/cart", {
      docTitle: "Your Cart",
      products: cart.products,
      totalPrice: cart.totalPrice,
    });
  });*/
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", { docTitle: "Checkout" });
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ "user.userId": req.user._id });
    console.log(orders);

    res.render("shop/orders", {
      docTitle: "Your Orders",
      orders: orders,
      isAuth: req.session.isLoggedIn,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const prodId = req.params.productId;
    const product = await Product.findById(prodId);
    res.render("shop/product-details", {
      docTitle: product.title,
      imgUrl: product.imgUrl,
      description: product.description,
      price: product.price,
      id: product._id,
      isAuth: req.session.isLoggedIn,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteProductCart = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    await req.user.deleteProductCart(prodId);

    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

exports.postCreateOrder = async (req, res, next) => {
  try {
    const data = await req.user.populate("cart.items.productId");

    const products = data.cart.items.map((p) => {
      return { quantity: p.quantity, product: { ...p.productId._doc } };
    });
    const order = new Order({
      user: { name: req.user.name, userId: req.user },
      products: products,
    });
    await order.save();
    await req.user.clearCart();
    res.redirect("/orders");
  } catch (err) {
    console.log(err);
  }
};
