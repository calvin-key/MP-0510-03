import { Request, Response, NextFunction } from 'express';
import { body, ValidationChain, validationResult } from 'express-validator';


const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array()
    });
  }
  next();
};


export const validateCreateVoucher: (ValidationChain | ((req: Request, res: Response, next: NextFunction) => void))[] = [
  body('eventId')
    .notEmpty()
    .withMessage('Event ID is required')
    .isInt()
    .withMessage('Event ID must be a number')
    .toInt(),
  
  body('code')
    .notEmpty()
    .withMessage('Code is required')
    .isString()
    .withMessage('Code must be a string')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Code must be between 3 and 50 characters'),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string')
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage('Description must be between 3 and 500 characters'),
  
  body('nominal')
    .notEmpty()
    .withMessage('Nominal is required')
    .isInt({ min: 1 })
    .withMessage('Nominal must be a positive number')
    .toInt(),
  
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive number')
    .toInt(),
  
  body('startAt')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date format')
    .custom((value) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
      }
      if (date <= new Date()) {
        throw new Error('Start date must be in the future');
      }
      return true;
    }),
  
  body('expiresAt')
    .notEmpty()
    .withMessage('Expiry date is required')
    .isISO8601()
    .withMessage('Expiry date must be a valid date format')
    .custom((value, { req }) => {
      const expiryDate = new Date(value);
      const startDate = new Date(req.body.startAt);
      
      if (isNaN(expiryDate.getTime())) {
        throw new Error('Invalid date format');
      }
      if (expiryDate <= new Date()) {
        throw new Error('Expiry date must be in the future');
      }
      if (expiryDate <= startDate) {
        throw new Error('Expiry date must be after start date');
      }
      return true;
    }),
  
  validate
];