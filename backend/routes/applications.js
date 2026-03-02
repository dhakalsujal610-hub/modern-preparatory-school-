const express = require('express');
const { Application } = require('../db');

const router = express.Router();

// middleware to require authentication
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
}

// retrieve applications (admin only)
// fetch all applications (admin only)
router.get('/', requireAuth, async (req, res) => {
  try {
    const apps = await Application.findAll({ order: [['submitted_at', 'DESC']] });
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// update status of single application
router.put('/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const [updated] = await Application.update({ status }, { where: { id: req.params.id } });
    if (updated) {
      const updatedApp = await Application.findByPk(req.params.id);
      return res.json({ success: true, application: updatedApp });
    }
    res.status(404).json({ error: 'Application not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// general update (can be extended later)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const [updated] = await Application.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedApp = await Application.findByPk(req.params.id);
      return res.json({ success: true, application: updatedApp });
    }
    res.status(404).json({ error: 'Application not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// delete a single application
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await Application.destroy({ where: { id: req.params.id } });
    if (deleted) {
      return res.json({ success: true });
    }
    res.status(404).json({ error: 'Application not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// bulk status update
router.put('/bulk/status', requireAuth, async (req, res) => {
  try {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No ids provided' });
    }
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    await Application.update({ status }, { where: { id: ids } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// bulk delete
router.delete('/bulk', requireAuth, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No ids provided' });
    }
    await Application.destroy({ where: { id: ids } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// create new application (public)
router.post('/', async (req, res) => {
  try {
    const { student_name, date_of_birth, grade_applying, parent_name, phone, email, address, previous_school, documents_info } = req.body;
    const app = await Application.create({
      student_name,
      date_of_birth,
      grade_applying,
      status: 'Pending',
      submitted_at: new Date(),
      parent_name,
      phone,
      email,
      address,
      previous_school,
      documents_info
    });
    res.json({ success: true, application: app });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create application' });
  }
});

module.exports = router;