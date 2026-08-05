/**
 * User Model
 * Mongoose schema for registered users with password hashing.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * - name, email (unique), password (hashed with bcryptjs)
 * - role: 'user' (customer) | 'seller' | 'admin' (default 'user')
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    role: {
      type: String,
      enum: ['user', 'seller', 'admin'],
      default: 'user',
    },
    // Cloudinary avatar URL. Customers and sellers both upload one.
    avatar: {
      type: String,
      default: '',
    },
    // Contact phone — editable by both customers and sellers.
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    // Short bio/about — customers control it fully; sellers cannot edit it
    // (their store description lives in `description`).
    about: {
      type: String,
      default: '',
      trim: true,
    },
    // Geographic location shown on public profiles.
    location: {
      type: String,
      default: '',
      trim: true,
    },
    // Customer-only profile fields.
    dob: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      default: '',
    },
    // Seller-only fields: what the store sells + the storefront blurb.
    businessCategory: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Hash the password before saving.
 * Only re-hashes when the password field is modified.
 */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compare an entered password against the stored hash.
 * @param {string} enteredPassword - Plain-text password from the login form
 * @returns {Promise<boolean>} True if the password matches
 */
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
