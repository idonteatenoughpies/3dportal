const mongoose = require ('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    first: {type: String, required: true},
    last: {type: String, required: true},
    street1: {type: String, required: true},
    street2: {type: String},
    town: {type: String, required: true},
    county: {type: String, required: true},
    postcode: {type: String, required: true},
    role: {type:String}
},
{collection: 'users'}
)

const model = mongoose.model('UserSchema', userSchema)

module.exports = model