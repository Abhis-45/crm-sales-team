const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Opportunity = require('../models/Opportunity');

// GET /api/opps - list opportunities (rep -> own only, manager/admin -> all)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'rep') {
      const opps = await Opportunity.find({ ownerId: req.user.id }).populate('ownerId', 'name email');
      return res.json(opps);
    }
    const opps = await Opportunity.find().populate('ownerId', 'name email');
    res.json(opps);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// PUT /api/opps/:id - update opportunity (rep only own)
router.put('/:id', auth, async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ msg: 'Opportunity not found' });

    if (req.user.role === 'rep' && opp.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    const { title, value, stage } = req.body;
    if (title !== undefined) opp.title = title;
    if (value !== undefined) opp.value = value;
    if (stage !== undefined) opp.stage = stage;

    await opp.save();
    res.json(opp);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/opps - create manual opportunity (optional)
router.post('/', auth, async (req, res) => {
  try {
    const { title, value, stage, leadId } = req.body;
    const opp = new Opportunity({ title, value: value || 0, stage: stage || 'Discovery', ownerId: req.user.id, leadId });
    await opp.save();
    res.json(opp);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;