const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
  site_name: {
    type: String,
    required: true,
    default: 'Elango Home Made Products'
  },
  description: {
    type: String,
    default: 'Premium quality home made products'
  },
  contact_email: {
    type: String,
    default: 'info@elangoproducts.com'
  },
  contact_phone: {
    type: String,
    default: '+91-9876543210'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Config', ConfigSchema);
