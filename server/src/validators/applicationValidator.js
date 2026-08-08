import { body } from 'express-validator';

export const validateApplication = [
  body('personalDetails.name').notEmpty().withMessage('Name is required'),
  body('personalDetails.email').isEmail().withMessage('Valid email is required'),
  body('personalDetails.rollNumber').notEmpty().withMessage('Roll Number is required'),
  body('personalDetails.contact').notEmpty().withMessage('Contact is required'),
  body('personalDetails.campus').isIn(['Main', 'East', 'West']).withMessage('Invalid campus'),
  body('personalDetails.branch').notEmpty().withMessage('Branch is required'),
  body('personalDetails.introduction').notEmpty().withMessage('Introduction is required'),
  body('personalDetails.reasonToJoin').notEmpty().withMessage('Reason to join is required'),
  body('department').isIn(['Tech', 'Graphic Design', 'Photography', 'Content', 'Video Editing']).withMessage('Invalid department'),
  body('departmentAnswers').notEmpty().withMessage('Department answers are required')
];
