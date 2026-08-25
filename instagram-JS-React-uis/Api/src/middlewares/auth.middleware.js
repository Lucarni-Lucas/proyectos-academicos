import { verifyToken } from '../utils/jwt.utils.js';

export const authenticate = (req, res, next) => {
  const configuredHeader = (process.env.AUTH_HEADER || 'authorization').toLowerCase();
  const authHeader = req.headers[configuredHeader] || req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};