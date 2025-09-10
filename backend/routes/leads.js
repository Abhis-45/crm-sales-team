const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Lead = require('../models/Lead');
const Opportunity = require('../models/Opportunity');

// GET /api/leads - list leads (rep -> own only, manager/admin -> all)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'rep') {
      const leads = await Lead.find({ ownerId: req.user.id }).populate('ownerId', 'name email');
      return res.json(leads);
    }
    const leads = await Lead.find().populate('ownerId', 'name email');
    res.json(leads);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/leads - create lead (owner defaults to current user)
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, phone, status } = req.body;
    const lead = new Lead({ name, email, phone, status: status || 'New', ownerId: req.user.id });
    await lead.save();
    res.json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// PUT /api/leads/:id - update lead (rep only own)
router.put('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ msg: 'Lead not found' });

    if (req.user.role === 'rep' && lead.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    const { name, email, phone, status } = req.body;
    lead.name = name ?? lead.name;
    lead.email = email ?? lead.email;
    lead.phone = phone ?? lead.phone;
    lead.status = status ?? lead.status;

    await lead.save();
    res.json(lead);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE /api/leads/:id - delete lead
router.delete('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ msg: 'Lead not found' });

    if (req.user.role === 'rep' && lead.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    await lead.remove();
    res.json({ msg: 'Lead removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/leads/:id/convert - convert lead -> opportunity
router.post('/:id/convert', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ msg: 'Lead not found' });

    if (req.user.role === 'rep' && lead.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    const { value } = req.body; // optional
    const title = `${lead.name} – First Deal`;

    const opp = new Opportunity({
      title,
      value: value || 0,
      stage: 'Discovery',
      ownerId: lead.ownerId,
      leadId: lead._id,
    });
    await opp.save();

    lead.status = 'Qualified';
    await lead.save();

    res.json({ opportunity: opp, lead });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;