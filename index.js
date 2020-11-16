const express = require('express'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser');
const app = express();

// Enables express to read form values
app.use(bodyParser.urlencoded({ extended: true }));
// Enables express to read cookies
app.use(cookieParser());

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Setup the routes

// Get the current user and set the res.locals.user and res.user objects so that
// all routes and all templates have access to the current user.
app.get('*', (req, res, next) => {
  // TODO: Get logged in user from session ID
  const emailCookie = req.cookies.user;

  if (emailCookie) {
    const user = {
      email: emailCookie,
    };
    res.locals.user = user;
    req.user = user;
  }
  next();
})

app.get('/', (req, res) => {
  res.render('pages/index');
});

app.get('/login', (req, res) => {
  res.render('pages/login');
});

app.post('/login', (req, res) => {
  console.log("Logging in with " + req.body.email + " and " + req.body.password);

  if (req.body.password === "invalid") {
    res.render('pages/login', {
      error: "Invalid password"
    });
    return;
  }

  res.cookie("user", req.body.email);

  res.redirect("/");
});

app.get("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect("/");
});

// Start the server
const listener = app.listen(8000);
console.log('Server is running on port ' + listener.address().port);
