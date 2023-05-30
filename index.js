const express = require('express');
const app = express();
const port = process.env.port || 5000;
const eHbs = require('express-handlebars');
const a = require('sequelize');
const { createStarsList } = require('./controllers/handlebarsHelper');
const { createPagination } = require('express-handlebars-paginate');

app.use(express.static(__dirname + '/public'));

app.engine('hbs', eHbs.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    defaultLayout: 'layout',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    },
    helpers: {
        createStarsList,
        createPagination
    }
}));
app.set('view engine', 'hbs');

// routes
app.use('/', require('./routes/indexRouter'));

app.use('/products', require('./routes/productsRouter'));

app.use((req, res, next) => {
    res.render('error', { message: 'File not Found' });
})

app.use((error, req, res, next) => {
    console.error(error);
    res.render('error', { message: 'Internal Server Error' });
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});