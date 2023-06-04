const models = require('../models');
const helper = require('./handlebarsHelper');
const controller = {};


controller.showHomePage = async (req, res) => {
    const recentProducts = await models.Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 10
    });

    const featuredProducts = await models.Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice'],
        order: [['stars', 'DESC']],
        limit: 10
    });

    const categories = await models.Category.findAll();
    const secondArray = categories.splice(2, 2);
    const thirdArray = categories.splice(1, 1);
    res.locals.categoryArray = [
        categories,
        secondArray,
        thirdArray
    ]
    const Brand = models.Brand;
    const brands = await Brand.findAll();

    res.render('index', { brands, featuredProducts, recentProducts });
}

controller.showPage = (req, res, next) => {
    const pages = ['cart', 'checkout', 'contact', 'index', 'login', 'my-account', 'product-detail', 'product-list', 'wishlist'];
    if (pages.includes(req.params.page))
        return res.render(req.params.page);

    next();
}

module.exports = controller;