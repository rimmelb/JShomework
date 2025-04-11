// helpers/validators.js
const { check } = require('express-validator');

const goalValidators = [
  check('date').isISO8601().withMessage('Hibás dátumformátum'),
  check('exercise').notEmpty().withMessage('Válassz gyakorlatot'),
  check('exerciseType').notEmpty().withMessage('Válassz gyakorlat típust'),
  check('goal').notEmpty().withMessage('Írj be egy célt')
];

const recordValidators = [
  check('date').isISO8601().withMessage('Hibás dátumformátum'),
  check('exercise').notEmpty().withMessage('Válassz gyakorlatot'),
  check('exerciseType').notEmpty().withMessage('Válassz gyakorlat típust'),
  check('record').notEmpty().withMessage('Írj be egy rekordot')
];

const workoutValidators = [
  check('date').isISO8601().withMessage('Hibás dátumformátum'),
  check('exercise.*').notEmpty().withMessage('Válassz gyakorlatot minden sorban'),
  check('exerciseType.*').notEmpty().withMessage('Válassz típus mindegyik sorban'),
  check('goal.*').notEmpty().withMessage('Írd be a célt minden sorban')
];

module.exports = {
  goalValidators,
  recordValidators,
  workoutValidators,
};