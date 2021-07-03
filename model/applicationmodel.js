const mongoose = require ('mongoose');

const applicationSchema = new mongoose.Schema({
    planningID: { type: ObjectID, required: true, unique: true },
    dateCreated: { type: Date, required: true },
    dateValidated: { type: Date },
    dateDecided: { type: Date },
    dateComments: { type: Date },
    committeeDate: { type: Date },
    consultationStart: { type: Date },
    consultationEnd: { type: Date },
    pressAdvert: { type: Date },
    determinationDeadline: { type: Date },
    status: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    applicant: {
        name: { type: String },
        address: { type: String },
        postcode: { type: String },
        phone: { type: String }, 
        required: true
    },
    agent: {
        name: { type: String },
        address: { type: String },
        postcode: { type: String },
        phone: { type: String }
    },
    propertyOwner: { type: String },
    applicationAddress: {
        street1: { type: String, required: true },
        street2: { type: String },
        town: { type: String, required: true },
        county: { type: String, required: true },
        postcode: { type: String, required: true },
    },
    modelRequired: { type: Boolean, required: true },
    model: { type: String },
    caseOfficer: { type: String },
    communityCouncil: { type: String },
    ward: { type: String },
    EIARequired: { type: Boolean },
    EIA: { type: String }

},
    { collection: 'applications' }
)

const model = mongoose.model('ApplicationSchema', applicationSchema)

module.exports = model