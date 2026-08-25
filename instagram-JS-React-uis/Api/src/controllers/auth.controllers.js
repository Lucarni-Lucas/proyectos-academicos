import { generateToken } from '../utils/jwt.utils.js';
import { loginUser, registerUser } from '../services/auth.services.js';
import { toUser } from '../utils/dto.utils.js';

const AUTH_HEADER_NAME = process.env.AUTH_HEADER || 'Authorization';

export const login = (req, res) => {
  const { email, password } = req.body;
  const { system } = req;

  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = loginUser(system, { email, password });
  

    const token = generateToken(user.id);

    res
      .header(AUTH_HEADER_NAME, `Bearer ${token}`)
      .status(200)
      .json(toUser(user, []));
  } catch (error) {
    
    res.status(400).json({ error: error.message });
  }
};


const isValidUrl = (value) => {
  if (typeof value !== 'string' || value.trim() === '') return false;

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export const register = (req, res) => {
  const { name, email, password, image } = req.body;
  const { system } = req;

  if (!name || !email || !password || !image) {
    return res.status(400).json({ error: 'name, email, password, and image are required' });
  }

  if (!isValidUrl(image)) {
    return res.status(400).json({ error: 'image must be a valid URL' });
  }

  try {
    const draftUser = {
      name,
      email,
      password,
      image
    };

    const user = registerUser(system, draftUser);
    const token = generateToken(user.id);

    res
      .header(AUTH_HEADER_NAME, `Bearer ${token}`)
      .status(200)
      .json(toUser(user, []));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};