const express = require('express');
const router = express.Router();
const { recordValidators } = require('./helpers/validators');
const recordController = require('./controllers/recordController');

router.get('/', recordController.listRecords);

router.get('/new', recordController.newRecordForm);

router.post('/', recordValidators, recordController.createRecord);

router.get('/:id/edit', recordController.editRecordForm);

router.post('/:id/edit', recordValidators, recordController.updateRecord);

router.post('/:id/delete', recordController.deleteRecord);

module.exports = router;
