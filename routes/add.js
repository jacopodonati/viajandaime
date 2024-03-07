const express = require('express');
const router = express.Router();
const { getClient } = require('../db');


router.get('/', (req, res) => {
    res.render('add', { title: 'Add new document' });
});


router.post('/', async (req, res) => {
    try {
        const client = await getClient(); 
        const database = client.db('da1me');
        const collection = database.collection('documents');

        const { issuerFirstName, issuerLastName } = req.body;

        const currentDate = new Date();

        const result = await collection.insertOne({
            issuerFirstName,
            issuerLastName,
            dateOfIssue: currentDate,
            lastEdit: currentDate
        });

        res.status(201).json({ message: 'New entry added to the database', insertedId: result.insertedId });
    } catch (error) {
        console.error('Error inserting data into the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
