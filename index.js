const express = require("express");
const apiRoutes = require("./routers/app.routers");
const loggerMiddleware = require("./middlewares/logger");
const Container = require("./models/Container.js");
const productApi = new Container("./data/data1.json");
const path = require("path");
const hbs = require("hbs");

const PORT = process.env.PORT || 8080;
const app = express();

// Middlewares
app.use(loggerMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static("public"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// Routes
app.use("/api", apiRoutes);

app.get("/products", async (req, res) => {
  const getProducts = await productApi.getAll();
  const products =
    getProducts.length > -1 && getProducts.length < 4
      ? false
      : JSON.parse(getProducts);
  res.render("products.hbs", {
    products,
  });
});

app.get("/", (req, res) => {
  res.render("index.hbs");
});

app.post("/save", async (req, res) => {
  await productApi.save(req.body);
  res.redirect("/");
});
// Server
const serverOn = app.listen(PORT, () => {
  console.log(`SERVER ON, listening on PORT: ${PORT}`);
});
// Error handler
serverOn.on("error", (error) => {
  console.error("ERROR", error);
});
