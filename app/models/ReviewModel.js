module.exports = function(app, config) {
    return app.getModel('Application', true).extend(function() {
        this.DBModel = this.mongoose.model('Review', new this.Schema({
            'product': String,
            'reviewerName': String,
            'reviewerWebsiteName': String,
            'reviewerWebsiteURL': String,
            'score': Number,
            'date': Date,
            'link': String,
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
                'tags': review.tags.split(',')
            });
            doc.save(callback)
        },
        find: function(id, callback) {
            this.DBModel.findById(id, callback)
        }
    })
}