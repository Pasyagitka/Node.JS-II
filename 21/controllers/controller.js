exports.loginFirst =  (req, res, next)=>  {
  if (req.session.logout && req.headers['authorization']) {
    req.session.logout = false;
    delete req.headers['authorization'];
  }
  next();
}

exports.loginSecond = (req, res, next) => {
  if (req.session.logout == undefined) {
    req.session.logout = false;
  }
  next();
}

exports.loginThird = (req, res, next)=> { 
  res.end('Success');
};


exports.logout = (req, res) => {
  req.session.logout = true;
  delete req.headers['authorization']; //?
  res.redirect('/login');
};

exports.resource = (req, res) => {
  if(req.session.logout == false && req.headers['authorization']) res.end('resource');
  else res.redirect('/login');
};