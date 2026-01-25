import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    trim: true 
  },
  email: { 
    type: String, 
    unique: true, 
    sparse: true, // Zaroori: Taaki phone-only users ke liye null conflict na ho
    lowercase: true 
  },
  phoneNumber: { 
    type: String, 
    unique: true, 
    sparse: true, // Zaroori: Taaki Google-only users ke liye null conflict na ho
    trim: true 
  },
  password: { 
    type: String 
  },
  googleId: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  image: { 
    type: String 
  },
  role: { 
    type: String, 
    enum: ['USER', 'ADMIN'], 
    default: 'USER' 
  },
  isPhoneVerified: { 
    type: Boolean, 
    default: false 
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);