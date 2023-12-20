import { Router } from "express";
import { ProductManager } from "../dao/product.manager.mdb.js";
import { CartManager } from "../dao/cart.manager.mdb.js";
import { UserManager } from "../dao/user.manager.mdb.js";

const router = Router();
const manager = new ProductManager();
const managerCart = new CartManager();
const managerUser = new UserManager();

router.get("/products", async (req, res) => {
  if (req.session.user) {
    const products = await manager.getProducts();
    res.render("products", {
      title: "Listado de productos",
      products: products,
    });
  } else {
    res.redirect("./login");
  }
});
router.get("/carts", async (req, res) => {
  const carts = await managerCart.getCarts();
  res.render("products", {
    title: "listado de productos",
    carts,
  });
});
router.get("/users", async (req, res) => {
  if (req.session.user && req.session.user.admin === true) {
    const data = await managerUser.getUsersPaginated(
      req.query.page || 1,
      req.query.limit || 50
    );

    data.pages = [];
    for (let i = 1; i <= data.totalPages; i++) data.pages.push(i);

    res.render("users", {
      title: "Listado de USUARIOS",
      data: data,
    });
  } else if (req.session.user) {
    res.redirect("/profile");
  } else {
    res.redirect("/login");
  }
});

router.get("/cookies", async (req, res) => {
  res.render("cookies", {});
});

router.get("/login", async (req, res) => {
  if (req.session.user) {
    res.redirect("/products");
  } else {
    res.render("login", {});
  }
});

router.get("/profile", async (req, res) => {
  if (req.session.user) {
    res.render("profile", { user: req.session.user });
  } else {
    res.redirect("/login");
  }
});

router.get("/register", async (req, res) => {
  try {
    res.redirect("/products");
  } catch (err) {
    res.redirect("/login");
  }
});
export default router;
