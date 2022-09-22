const express = require("express");
const apiRoutes = require("./routers/app.routers");
const loggerMiddleware = require("./middlewares/logger");

const Container = require("./models/Container.js");
const productApi = new Container("./data/data1.json");

const PORT = process.env.PORT || 8080;
const app = express();

// Middlewares
app.use(loggerMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static("public"));
app.set("views", "./views");

app.set("view engine", "pug");

// Routes
app.use("/api", apiRoutes);

app.get("/products", async (req, res) => {
  const products = await productApi.getAll();
  res.render("products.pug", { products: JSON.parse(products) });
});

app.get("/", (req, res) => {
  res.render("index");
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
