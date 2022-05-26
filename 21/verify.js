exports.getCredential = (trusted, user) => {
  return trusted.find(u => u.login.toLowerCase() === user.toLowerCase());
};
exports.verificatePassword = (pass1, pass2) => {
  return pass1 === pass2;
};
