module.exports = function(app) {
    return {
        root: [
            ['get', '/', 'Home'],
            ['get', '/product/:name', 'Product']
        ],
        admin: [
            ['get', '/', 'Admin'],
            ['get', '/review', 'Admin', 'review'],
            ['post', '/review/new', 'Admin', 'newReview'],
            ['get', '/import/:site', 'Admin', 'import']
        ]
    }
}