module.exports.globalErrorHandler = (err, req, res, next) => {
  const status = err?.status ? err.status : "Failed";
  const message = err?.message;
  const stack = err?.stack;
  res.status(500).json({ status, message, stack });
};

module.exports.notFoundHandler = (req, res, next) => {
  const err = new Error(`Not found ${req.originalUrl} on the server`);
  next(err);
};
