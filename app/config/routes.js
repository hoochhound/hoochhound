module.exports = function(app) {
    return {
        root: [
            ['get', '/', 'Home'],
            ['get', '/product/:name', 'Product']
        ],
        admin: [
            ['get', '/', 'Admin'],
            ['get', '/product/list/:type/:pageNum?', 'Admin', 'listProduct'],
            ['get', '/product/:id/remove', 'Admin', 'removeProduct'],
            ['get', '/product/:id/review/list', 'Admin', 'listProductReview'],
            ['post', '/product/:id/review/add', 'Admin', 'addReviewPost'],
            ['get', '/product/:id/review/add', 'Admin', 'addReview'],
            ['get', '/import/:site', 'Import', 'import']
        ]
    }
}