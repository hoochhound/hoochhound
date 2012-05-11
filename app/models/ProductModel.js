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
                index: {
                    unique: true
                }
            },
            'producerName': String,
            'primaryCategory': String,
            'secondaryCategory': String,
            'origin': String,
            'alcoholContent': Number,
            'kosher': Boolean,
            'servingSuggestion': String,
            'tastingNote': String,
            'packages': [Package],
            'tags': [String]
        }));
    }).methods({
        create: function(newDoc, callback) {
            var doc = new this.DBModel(newDoc);
            doc.save(callback);
        },
        remove: function(conditions, callback) {
            this.DBModel.remove(conditions, callback);
        },
        find: function(id, callback) {
            this.DBModel.findById(id, callback)
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
            var query = MyModel.find(q).sort(['name'], 1).skip((pageNumber * resultsPerPage) - resultsPerPage).limit(resultsPerPage);
            query.exec(function(error, results) {
                if (error) {
                    callback(error);
                } else {
                    MyModel.count(q, function(error, count) {
                        if (error) {
                            callback(error);
                        } else {
                            callback(null, Math.ceil(count / resultsPerPage), results);
                        }
                    });
                }
            });
        }
    });
}