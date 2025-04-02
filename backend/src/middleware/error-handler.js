const errorHandler = async (error, req, res, next) => {
  res.status(error.statsCode || 500).json({ message: error.message || "Server Error" });
};

export default errorHandler;
