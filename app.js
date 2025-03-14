const fs = require('fs'); // Import File System module
const https = require('https'); // Import HTTPS module
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');

const app = express();

// Load SSL certificate and key
const options = {
    key: fs.readFileSync('/etc/ssl/mycerts/selfsigned.key'),
    cert: fs.readFileSync('/etc/ssl/mycerts/selfsigned.crt')
};

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Define port
const port = 8443;

// Start HTTPS server
https.createServer(options, app).listen(port, () => {
    console.log(`Server is running securely on https://<your-public-ip>:${port}`);
});

