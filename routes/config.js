const express = require('express');
const Config = require('../models/Config');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/config/site-name
// @desc    Get site name
// @access  Public
router.get('/site-name', async (req, res) => {
  try {
    let config = await Config.findOne();
    
    // If no config exists, create default one
    if (!config) {
      config = new Config({
        site_name: 'Elango Home Made Products'
      });
      await config.save();
    }
    
    res.json({ site_name: config.site_name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/config/site-name
// @desc    Update site name
// @access  Admin only
router.put('/site-name', auth, adminOnly, async (req, res) => {
  try {
    const { site_name } = req.body;
    
    if (!site_name || site_name.trim().length === 0) {
      return res.status(400).json({ message: 'Site name is required' });
    }
    
    let config = await Config.findOne();
    
    if (!config) {
      // Create new config if none exists
      config = new Config({ site_name: site_name.trim() });
    } else {
      // Update existing config
      config.site_name = site_name.trim();
    }
    
    await config.save();
    
    res.json({ 
      message: 'Site name updated successfully',
      site_name: config.site_name 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/config
// @desc    Get all config settings
// @access  Public
router.get('/', async (req, res) => {
  try {
    let config = await Config.findOne();
    
    // If no config exists, create default one
    if (!config) {
      config = new Config();
      await config.save();
    }
    
    res.json(config);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/config
// @desc    Update config settings
// @access  Admin only
router.put('/', auth, adminOnly, async (req, res) => {
  try {
    const { site_name, description, contact_email, contact_phone } = req.body;
    
    let config = await Config.findOne();
    
    if (!config) {
      config = new Config();
    }
    
    // Update fields if provided
    if (site_name) config.site_name = site_name.trim();
    if (description) config.description = description.trim();
    if (contact_email) config.contact_email = contact_email.trim();
    if (contact_phone) config.contact_phone = contact_phone.trim();
    
    await config.save();
    
    res.json({ 
      message: 'Configuration updated successfully',
      config 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
