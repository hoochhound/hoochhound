module.exports = function(app, config) {
    return app.getModel('Application', true).extend(function() {
        var Package = new this.Schema({
            'storeName': String,
            'productId': Number,
            'packageUnitType': String,
            'packageUnitVolume': Number,
            'packageUnits': Number,
            'productPrice': Number
        });
        this.DBModel = this.mongoose.model('Product', new this.Schema({
            'name': {
                type: String,
                index: true
            },
            'producer_name': String,
            'primaryCategory': String,
            'secondaryCategory': String,
            'origin': String,
            'alcohol_content': Number,
            'is_kosher': Boolean,
            'serving_suggestion': String,
            'tasting_note': String,
            'packages': [Package],
            'tags': [String]
        }));
    }).methods({
        create: function(newDoc, callback) {
            var doc = new this.DBModel(newDoc);
            doc.save(callback);
        },
        findByName: function(query, callback) {
            this.DBModel.findOne({
                'name': query
            }, callback);
        },
        listAll: function(callback) {
            this.DBModel.find({}, ['name', 'id'], callback);
        },
        listByType: function(query, callback) {
            this.DBModel.find({
                primaryCategory: query
            }, ['name', 'id'], callback);
        },
        paginate: function(q, pageNumber, resultsPerPage, callback) {
            var MyModel = this.DBModel;
            var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;
            var query = MyModel.find(q).skip(skipFrom).limit(resultsPerPage);
            query.exec(function(error, results) {
                if (error) {
                    callback(error, null, null);
                } else {
                    MyModel.count(q, function(error, count) {
                        if (error) {
                            callback(error, null, null);
                        } else {
                            var pageCount = Math.floor(count / resultsPerPage);
                            callback(null, pageCount, results);
                        }
                    });
                }
            });
        }
    });
}