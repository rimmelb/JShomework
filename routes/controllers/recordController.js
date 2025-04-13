// controllers/recordController.js
const Record = require('../../models/record');
const { EXERCISE_TYPES } = require('../helpers/constants');

/**
 * Rekordok listázása.
 */
async function listRecords(req, res, next) {
  try {
    const records = await Record.find({});
    res.render('records', { records });
  } catch (err) {
    next(err);
  }
}

/**
 * Új rekord űrlap megjelenítése.
 */
function newRecordForm(req, res) {
  res.render('new_record', { data: {}, errors: [], types: EXERCISE_TYPES });
}

/**
 * Új rekord mentése.
 */
async function createRecord(req, res, next) {
  try {
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('new_record', { data: req.body, errors: errors.array(), types: EXERCISE_TYPES });
    }
    const newRecord = new Record(req.body);
    await newRecord.save();
    res.redirect('/records');
  } catch (err) {
    next(err);
  }
}

/**
 * Rekord szerkesztő űrlap megjelenítése.
 */
async function editRecordForm(req, res, next) {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) return res.status(404).send('A rekord nem található');
    res.render('edit_record', { record, types: EXERCISE_TYPES, errors: [] });
  } catch (err) {
    next(err);
  }
}

/**
 * Rekord módosítása.
 */
async function updateRecord(req, res, next) {
  try {
    let record = await Record.findById(req.params.id);
    if (!record) return res.status(404).send('A rekord nem található');
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('edit_record', { record: { ...record.toObject(), ...req.body }, errors: errors.array(), types: EXERCISE_TYPES });
    }
    Object.assign(record, req.body);
    await record.save();
    res.redirect('/records');
  } catch (err) {
    next(err);
  }
}

/**
 * Rekord törlése.
 */
async function deleteRecord(req, res, next) {
  try {
    await Record.findByIdAndDelete(req.params.id);
    res.redirect('/records');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listRecords,
  newRecordForm,
  createRecord,
  editRecordForm,
  updateRecord,
  deleteRecord,
};
