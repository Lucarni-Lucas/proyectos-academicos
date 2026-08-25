export const loginUser = (system, credentials) => {
  const { email, password } = credentials;
  return system.login(email, password);
};

export const registerUser = (system, draftUser) => {
  return system.register(draftUser);
};