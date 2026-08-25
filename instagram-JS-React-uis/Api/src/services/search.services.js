export const searchUsers = (system, query) => {
  return system.searchByName(query);
};

export const searchPosts = (system, query) => {
  return system.searchByTag(query);
};
