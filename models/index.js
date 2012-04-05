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
        'keywords': [String]
    });

    mongoose.model('Product', Product);

    next();
}

exports.defineModels = defineModels;
