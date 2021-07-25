const mongoose = require ('mongoose');

const threedModelSchema = new mongoose.Schema({
    filename: { type: String, required: true, unique: true },
    filepath: { type: String, required: true },  
    originalName: { type: String, required: true },  
    planningID: { type: String, required: true },  
},
    { collection: 'models' }
)
threedModelSchema.index({ "$**": "text" })

const model = mongoose.model('threedModelSchema', threedModelSchema)

module.exports = model