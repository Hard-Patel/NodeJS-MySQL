function admin(req, res, next) {
  const {isAdmin} = req.user;
  if (!isAdmin) {
    return res.status(403).send({ message: "Permission not allowed" });
  }
  next();
}

exports.admin = admin;
