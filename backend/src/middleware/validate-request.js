import { validationResult } from "express-validator";

const validateRequest = (validators) => {
  return [
    validators,
    async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const formatted = errors.formatWith(({ msg }) => msg);
        return res.status(400).json({ errors: formatted.mapped() });
      }

      next();
    },
  ];
};

export default validateRequest;
