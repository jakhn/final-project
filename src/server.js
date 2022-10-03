const express = require('express');
const PORT = process.env.PORT || 8000;
const router = express();

router.use(express.json());
router.use(express.static(process.cwd(), 'front'));

// res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:5500 ');

const accountController = require('./controllers/account.js');
const bookController = require('./controllers/book.js');
const rentalInfoController = require('./controllers/rental_info.js');

// crud for account
router.post('/account', accountController.POST);
router.get('/account', accountController.GET);
router.get('/account/:id', accountController.GET_ID);
router.put('/account/:id', accountController.PUT);
router.delete('/account/:id', accountController.DELETE);

// crud for book_details
router.post('/book', bookController.POST);
router.get('/book', bookController.GET);
router.get('/book/:id', bookController.GET_ID);
router.put('/book/:id', bookController.PUT);
router.delete('/book/:id', bookController.DELETE);

// crud for rental_info

router.get('/rental_info/:accountId', rentalInfoController.GET_ACCOUNT_ID);
router.put('/rental_info/', rentalInfoController.POST);

router.listen(PORT, () =>
  console.log('Server is running on http://localhost:' + PORT)
);
module.exports = router;
