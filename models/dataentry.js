var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DataSchema = new Schema({
    company: { type: String, lowercase: true, default: "company" },
    opb: { type: Number, lowercase: true, default: 0 },
    debit: { type: Number, lowercase: true, default: 0 },
    credit: { type: Number, lowercase: true, default: 0 },
    clb: { type: Number, lowercase: true, default: 0 },
    date: { type: Date, default: Date.now }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updateAt'
    }
})

module.exports = mongoose.model('Data', DataSchema);