require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || 'secret123';
if (process.env.NODE_ENV === 'production' && jwtSecret === 'secret123') {
  console.warn('⚠️ WARNING: Using default JWT_SECRET in production is insecure!');
}

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kitchen_hearth',
  JWT_SECRET: jwtSecret,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
};



