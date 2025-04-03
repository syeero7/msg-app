const authorize = (req, res, next) => {
  if (req.user && req.method === "GET") return next();
  if (Number(req.params.userId) === req.user.id) return next();
  return res.sendStatus(403);
};

export default authorize;
