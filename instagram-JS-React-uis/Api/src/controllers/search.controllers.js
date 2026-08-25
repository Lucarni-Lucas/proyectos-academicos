
import { searchUsers, searchPosts } from '../services/search.services.js';
import { toSearchResult } from '../utils/dto.utils.js';

export const search = (req, res) => {
  const { query } = req.query;
  const { system } = req;

  if (!query) {
    return res.status(400).json({ error: 'query parameter is required' });
  }

  try {
    const users = searchUsers(system, query);
    const posts = searchPosts(system, query);
    res.status(200).json(toSearchResult(users, posts));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
