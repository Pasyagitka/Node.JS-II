const fs = require('fs');

exports.returnForm = (req, res) => {
  fs.ReadStream('./views/login.html').pipe(res);
}

exports.logout = (req, res) => {
  res.clearCookie('remember_me');
  req.logout();
  res.redirect('/login');
};

exports.resource = (req, res) => {
  if (req.user) {
    res.send('resource');
  } else {
    res.redirect(401, '/login');
  }
};