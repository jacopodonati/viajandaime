const express = require('express');
const router = express.Router();
const Document = require('../../models/document');
const i18n = require('i18n');

router.get('/', async (req, res) => {
    res.redirect('/list');
});

router.get('/:hash', async (req, res) => {
    const hash = req.params.hash;
    const isAdmin = req.query.hasOwnProperty('admin');
    
    try {
        let document;
        if (isAdmin) {
            document = await Document.findById(hash);
        } else {
            document = await Document.findOne({ _id: hash, deleted: false });
        }

        if (document) {
            res.render('documents/single', {
                title: i18n.__("document") + ': ' + document._id + ' - ' + i18n.__('app_name'),
                document: document,
                isAdmin
            });
        } else {
            res.redirect('/list');
        }
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.use('/static', express.static('static'));

module.exports = router;
