const mongoose = require ('mongoose');

const planningIDModelSchema = new mongoose.Schema({
    year: { type: String, required: true},
    count: { type: String, required: true },  
},
    { collection: 'planningIDs' }
)

const model = mongoose.model('planningIDModelSchema', planningIDModelSchema)

module.exports = model