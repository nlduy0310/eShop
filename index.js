require("dotenv").config();
console.log(process.env.REDIS_URL);

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const eHbs = require("express-handlebars");
const a = require("sequelize");
const { createStarsList } = require("./controllers/handlebarsHelper");
const { createPagination } = require("express-handlebars-paginate");
const session = require("express-session");
const redisStore = require("connect-redis").default;
const { createClient } = require("redis");
const redisClient = createClient({
  url: process.env.REDIS_URL,
});
redisClient.connect().catch(console.error);
const passport = require("./controllers/passport");
const flash = require("connect-flash");

// cau hinh thu muc static
app.use(express.static(__dirname + "/public"));

// cau hinh view engine
app.engine(
  "hbs",
  eHbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    extname: "hbs",
    defaultLayout: "layout",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
    helpers: {
      createStarsList,
      createPagination,
    },
  }),
);
app.set("view engine", "hbs");

// cau hinh doc du lieu post tu body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new redisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 20 * 60 * 1000, // 20min
    },
  }),
);

// cau hinh su dung passport
app.use(passport.initialize());
app.use(passport.session());

// cau hinh su dung connect-flash
app.use(flash());

// middleware khoi tao gio hang
app.use((req, res, next) => {
  let Cart = require("./controllers/cart");
  req.session.cart = new Cart(req.session.cart ? req.session.cart : {});
  res.locals.quantity = req.session.cart.quantity;
  res.locals.isLoggedIn = req.isAuthenticated();
  next();
});

// routes
app.use("/", require("./routes/indexRouter"));
app.use("/products", require("./routes/productsRouter"));
app.use("/users", require("./routes/authRouter"));
app.use("/users", require("./routes/usersRouter"));
app.use((req, res, next) => {
  res.render("error", { message: "File not Found" });
});
app.use((error, req, res, next) => {
  console.error(error);
  res.render("error", { message: "Internal Server Error" });
});

// start app
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
