module.exports = function(app) {
    return {
        root: [
            ['get', '/', 'Home'],
            ['get', '/product/:name', 'Product']
        ],
        admin: [
            ['get', '/', 'Admin'],
            ['post', '/review/new', 'Admin', 'newReview'],
            ['get', '/review/:type', 'Admin', 'review'],
            ['get', '/list/products/:type/:pageNum?', 'Admin', 'listProduct'],
            ['post', '/product/:id/add/review', 'Admin', 'doAddReview'],
            ['get', '/product/:id/add/review', 'Admin', 'addReview'],
            ['get', '/product/:id/list/review', 'Admin', 'listReview'],
            ['get', '/import/:site', 'Admin', 'import']
        ]
    }
}