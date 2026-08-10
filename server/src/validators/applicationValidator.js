import { body } from 'express-validator';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const rollNumberRegex = /^2026[A-Z]{3}\d{4}$/;

export const validateApplication = [
  body('personalDetails.name').notEmpty().withMessage('Name is required'),
  body('personalDetails.email').matches(emailRegex).withMessage('Invalid email address format'),
  body('personalDetails.rollNumber').matches(rollNumberRegex).withMessage('Invalid NSUT Roll Number format (e.g. 2026UIN3341)'),
  body('personalDetails.contact').notEmpty().withMessage('Contact is required'),
  body('personalDetails.campus').isIn(['Main', 'East', 'West']).withMessage('Invalid campus'),
  body('personalDetails.branch').notEmpty().withMessage('Branch is required'),
  body('personalDetails.introduction').notEmpty().withMessage('Introduction is required'),
  body('personalDetails.reasonToJoin').notEmpty().withMessage('Reason to join is required'),
  body('department').isIn(['Tech', 'Graphic Design', 'Photography', 'Content', 'Video Editing']).withMessage('Invalid department'),
  body('departmentAnswers').notEmpty().withMessage('Department answers are required')
];
