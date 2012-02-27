var Product = new Schema({
    'name': String,
    'primary_category': String,
    'secondary_category': String,
    'origin': String,
    'producer_name': String,
    'stores': [Store],
    'keywords': [String]
});

mongoose.model('Product', Product);