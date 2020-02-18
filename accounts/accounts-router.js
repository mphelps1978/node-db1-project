const express = require('express');

// database access using knex
const db = require('../data/dbConfig');


const router = express.Router();


// GET

router.get('/', (req, res) => {
    console.log(req);

    let {limit = 5, sortby = 'id', sortdir = 'asc'} = req.query
    db('accounts')
    .orderBy(sortby, sortdir)
    .limit(limit)
    .then(accounts => {
        res.status(200).json(accounts)
    })
    .catch(err =>{
        console.log(err.message);
        res.status(500).json({message: 'There was an error fetching the accounts'})

    })
})

// GET BY ID
router.get('/:id', (req, res) => {
    db('accounts')
    .where({id: req.params.id})
    .then(account => {
        res.status(200).json(account)
    })
    .catch(err => {
        console.log(err.message);
        res.status(500).json({message: 'There was an error fetching the account'})
    })
})

// POST
router.post('/', (req, res) => {
    const body = req.body
    db('accounts')
    .insert(body)
    .then(account => {
        console.log
        db('accounts')
        .where('id', account[0])
        .then(result => {
            console.log(result)
            res.status(201).json({created: result})
        })
        .catch(err => {
            console.log(err.message);
            res.status(550).json({message: 'Record inserted, but cannot retrieve'})

        })
    })
    .catch(err => {
        console.log(err.message);
        res.status(500).json({message: 'There was an error adding the record'})

    })
})


// UPDATE

router.put('/:id', validateID, (req, res) => {
    const body = req.body
    db('accounts')
    .where({id: req.params.id})
    .update(body)
    .then(updated => {
        db('accounts')
        .where({id: req.params.id})
        .then(account => {
            res.status(200).json({message: 'Updated' , account})
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).json({message: 'Record updated, but cannot retrieve'})

        })
    })
    .catch(err => {
        console.log(err.message);
        res.status(500).json({message: 'There was an error updating the record'})
    })
})

// DELETE

router.delete('/:id', validateID, (req, res) => {
    db('accounts')
    .where({id: req.params.id})
    .del()
    .then(deleted => {
        res.status(200).json({message: 'Record Deleted'})
    })
    .catch(err => {
        console.log(err.message);
        res.status(500).json({message: 'There was an error deleting the record'})
    })
})



function validateID(req, res, next) {
    db('accounts')
    .where({id: req.params.id})
      .then(account => {
        if (!account) {
          res.status(400).json({ message: 'Invalid account ID' });
        } else {
          req.user = req.params.id;
          next();
        }
      })
      .catch(err => {
        console.log(err.message);
        res.status(500).json({ message: 'Error validating account ID' });
      });
}

module.exports = router