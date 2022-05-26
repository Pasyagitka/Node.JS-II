exports.getCredential = async (trusted, user) => {
  let users = await trusted.findAll({raw : true});
  let res =  users.find(u =>  u.login.toLowerCase() == user.toLowerCase());
  return res;
};
exports.verificatePassword = (pass1, pass2) => {
  return pass1 === pass2;
};
