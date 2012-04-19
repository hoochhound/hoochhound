module.exports = function(app) {
    return {
        root: [
            ['get', '/', 'Home'],
            ['get', '/product/:name', 'Product']
        ],
        admin: [
            ['get', '/', 'Admin']
        ]
    }
}