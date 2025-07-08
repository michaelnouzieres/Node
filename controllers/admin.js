const Product = require("../models/product");

exports.getProductAdd = (req, res, next) => {
  res.render("admin/add-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    layout: false,
    isAuth: req.session.isLoggedIn,
  });
};

exports.postProductAdd = async (req, res, next) => {
  const title = req.body.title;
  const imgUrl = req.body.imgUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imgUrl: imgUrl,
    userId: req.user._id,
  });

  try {
    await product.save();
    res.redirect("/products");
  } catch (err) {
    console.log(err);
  }
};

exports.getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render("admin/products", {
      prods: products,
      docTitle: "Admin Products",
      hasProducts: products.length > 0,
      layout: false,
      isAuth: req.session.isLoggedIn,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getEditProducts = async (req, res, next) => {
  try {
    const prodId = req.params.productId;
    const product = await Product.findById(prodId);
    res.render("admin/edit-product", {
      docTitle: "Edit Product",
      title: product.title,
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

exports.postEditProduct = async (req, res, next) => {
  const newTitle = req.body.title;
  const newImgUrl = req.body.imgUrl;
  const newDescription = req.body.description;
  const newPrice = req.body.price;
  const prodId = req.body.productId;

  try {
    let product = await Product.findById(prodId);

    product.title = newTitle;
    product.price = newPrice;
    product.description = newDescription;
    product.imgUrl = newImgUrl;

    await product.save();

    res.redirect("products");
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;

  try {
    await Product.deleteOne({ _id: prodId });

    res.redirect("products");
  } catch (err) {
    console.log(err);
  }
};
