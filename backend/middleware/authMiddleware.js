import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Remove "Bearer " if included
    const finalToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    
    // Default secret for dev purposes, should be placed in .env
    const decoded = jwt.verify(finalToken, process.env.JWT_SECRET || 'fallback_secret_key');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;
