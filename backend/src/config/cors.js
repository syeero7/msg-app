export const corsOptions = {
  origin: (origin, callback) => {
    const { NODE_ENV, ALLOWED_ORIGIN } = process.env;

    if (!origin && NODE_ENV === "development") {
      callback(null, true);
      return;
    }

    if (ALLOWED_ORIGIN === origin) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
};
