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
            ['get', '/import/:site', 'Admin', 'import']
        ]
    }
}