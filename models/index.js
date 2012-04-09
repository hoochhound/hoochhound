function defineModels(mongoose, next) {
    var Schema = mongoose.Schema;

    var Package = new Schema({
        'storeName': String,
        'productId': Number,
        'packageUnitType': String,
        'packageUnitVolume': Number,
        'packageUnits': Number,
        'productPrice': Number
    });

    var Product = new Schema({
        'name': {
            type: String,
            index: true
        },
        'primaryCategory': String,
        'secondaryCategory': String,
        'origin': String,
        'producer_name': String,
        'packages': [Package],
        'tags': [String]
    });

    var Review = new Schema({
        'product': String,
        'reviewerName': String,
        'reviewerWebsiteName': String,
        'reviewerWebsiteURL': String,
        'score': Number,
        'date': Date,
        'link': String,
        'blurb': String,
        'tags': [String]
    });

    mongoose.model('Product', Product);
    mongoose.model('Review', Review);

    next();
}

exports.defineModels = defineModels;