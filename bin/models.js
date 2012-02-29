function defineModels(mongoose, fn) {
    var Schema = mongoose.Schema;

    Product = new Schema({
        'name': {
            type: String,
            index: true
        },
        'primaryCategory': String,
        'secondaryCategory': String,
        'origin': String,
        'producer_name': String,
        'product_ids': {
            'lcbo': Number
        },
        'keywords': [String]
    });

    Package = new Schema({
        'productName': {
            type: String,
            index: true
        },
        'storeName': String,
        'productId': Number,
        'packageUnitType': String,
        'packageUnitVolume': Number,
        'packageUnits': Number,
        'productPrice': Number
    });

    mongoose.model('Product', Product);
    mongoose.model('Package', Package);

    fn();
}

exports.defineModels = defineModels;