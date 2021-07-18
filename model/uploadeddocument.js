const mongoose = require ('mongoose');

const uploadSchema = new mongoose.Schema({
    planningRef: {type: String, required: true},
    filepath: {type: String, required: true},
    filename: {type: String, required: true},
    originalName: {type: String, required: true},
    description: {type: String, required: true}
},
{collection: 'uploads'}
)

const model = mongoose.model('UploadSchema', uploadSchema)

module.exports = model