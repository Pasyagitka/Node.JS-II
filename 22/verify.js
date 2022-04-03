exports.getCredential = async (trusted, user) => {
  let users = await trusted.findAll({raw : false});
  return users.find(u => u.login.toLowerCase() === user.toLowerCase());
};
exports.verificatePassword = (pass1, pass2) => {
  return pass1 === pass2;
};
