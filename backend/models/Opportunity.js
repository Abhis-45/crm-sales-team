const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    value: { type: Number, default: 0 },
    stage: { type: String, enum: ['Discovery', 'Proposal', 'Won', 'Lost'], default: 'Discovery' },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Opportunity', OpportunitySchema);