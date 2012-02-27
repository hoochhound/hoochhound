function defineModels(mongoose, fn) {
    var Schema = mongoose.Schema;
    /**
     * Model: Product
     */

    Product = new Schema({
        'name': {
            type: String,
            index: true
        },
        'keywords': [String],
        'primary_category': String,
        'secondary_category': String,
        'origin': String,
        'producer_name': String,
        'product_ids': {
            'lcbo': Number
        }
    });
    
    mongoose.model('Product', Product);
    
    fn();
}

exports.defineModels = defineModels; 