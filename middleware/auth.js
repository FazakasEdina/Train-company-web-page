import jwt from 'jsonwebtoken';

const secret = 'Fm3ytJxQGDFqXG9';

export function decodeJWTToken(req, res, next) {
  res.locals.payload = {};
  if (req.cookies.token) {
    try {
      // view locals payload setting
      res.locals.payload = jwt.verify(req.cookies.token, secret);
    } catch (err) {
      res.clearCookie('token');
    }
  }
  next();
}

export function checkJWTToken(req, res, next) {
  if (Object.keys(res.locals.payload).length !== 0) {
    next(); // payload exists
  } else {
    // is not loged in
    res.status(401).redirect('/loginPage');
  }
}
