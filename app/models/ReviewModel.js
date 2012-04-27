module.exports = function(app, config) {
    return app.getModel('Application', true).extend(function() {
        this.DBModel = this.mongoose.model('Review', new this.Schema({
            'product': {
                type: String,
                required: true
            },
            'reviewerName': String,
            'reviewerWebsiteName': String,
            'reviewerWebsiteURL': String,
            'score': {
                type: Number,
                min: 0,
                max: 100
            },
            'date': Date,
            'link': {
                type: String,
                match: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
            },
            'blurb': String,
            'tags': [String]
        }));
    }).methods({
        create: function(review, callback) {
            var doc = new this.DBModel({
                'product': review.product,
                'reviewerName': review.reviewerName,
                'reviewerWebsiteName': review.reviewerWebsiteName,
                'reviewerWebsiteURL': review.reviewerWebsiteURL,
                'score': review.score,
                'date': review.date,
                'link': review.link,
                'blurb': review.blurb,
                'tags': review.tags
            });
            doc.save(callback)
        },
        find: function(id, callback) {
            this.DBModel.findById(id, callback)
        },
        countProductArray: function(array, conditions, callback) {
            array.forEach(function(doc) {
                this.DBModel.count({
                    product: conditions
                }, function(count) {
                    doc.reviewCount = count;
                });)
            }
            callback(array);
        }
    });
}