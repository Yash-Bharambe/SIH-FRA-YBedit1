import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['admin', 'district_officer', 'tribal_welfare', 'forest_dept', 'revenue_dept', 'ngo', 'public'],
    required: true,
  },
  department: {
    type: String,
    required: function() { return this.role !== 'public'; },
  },
  state: {
    type: String,
    required: true,
    enum: ['Madhya Pradesh', 'Tripura', 'Odisha', 'Telangana'],
  },
  district: {
    type: String,
    required: function() { return this.role !== 'public'; },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  last_login: {
    type: Date,
  },
});

// Add password hashing middleware here
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    // You'll need to install bcryptjs and import it
    // const salt = await bcrypt.genSalt(10);
    // this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const User = mongoose.model('User', userSchema);