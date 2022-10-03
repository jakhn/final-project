const fs = require('fs'); 

const GET_ACCOUNT_ID = (req, res) => {
  if (!req.params.accountId) {
    return res
      .json({
        message: 'customerId kiritilmadi!',
        status: 400,
      })
      .status(400);
  }
  let rents = fs.readFileSync(process.cwd(), 'database', 'rental_info.json', 'UTF-8');
  rents = rents ? JSON.parse(rents) : [];
  let findRent = rents.filter(rent => rent.accountId == req.params.accountId);

  let accounts = fs.readFileSync(process.cwd(), 'database', 'account.json','UTF-8');
  accounts = accounts ? JSON.parse(accounts) : [];

  let books = fs.readFileSync(process.cwd(), 'database', 'food.json', 'UTF-8');
  books = books ? JSON.parse(books) : [];

  findRent = findRent.map(rent => {
    rent.account = accounts.find(account => account.id == rent.accountId);
    rent.book = books.find(book => book.id == rent.bookId);
    return rent;
  });

  res.json(findRent);
};

const POST = (req, res) => {
  if (!req.body) {
    return res
      .json({
        message: "Bodydan ma'lumot kelmadi",
        status: 400,
      })
      .status(400);
  }
  const { accountId, bookId, count } = req.body;
  if (!accountId || !bookId || !count) {
    return res
      .json({
        message: "Ma'lumot to'liq emas!",
        status: 400,
      })
      .status(400);
  }

  let accounts = fs.readFileSync(process.cwd(), 'database', 'account.json', 'UTF-8' );
  accounts = accounts ? JSON.parse(accounts) : [];
  if (!accounts.find(account => account.id == req.body.accountId)) {
    return res
      .json({
        message: "Bunday Id'li customer mavjud emas!",
        status: 404,
      })
      .status(404);
  } 

  let books = fs.readFileSync(process.cwd(), 'database', 'book.json', 'UTF-8');
  books = books ? JSON.parse(books) : [];
  if (!books.find(book => book.id == req.body.bookId)) {
    return res
      .json({
        message: "Bunday Id'li kitob mavjud emas!",
        status: 404,
      })
      .status(404);
  }

  let rents = fs.readFileSync( process.cwd(), 'database', 'rent_info.json', 'UTF-8' );
  rents = rents ? JSON.parse(rents) : []; 

  const findRent = rents.find(
    rent => rent.AccountId == req.body.accountId && rent.bookId == req.body.bookId
  );
  if (findRent) {
    findRent.count += +count;
  } else {
    const newAccount = {
      id: rents.length ? rents[rents.length - 1].id + 1 : 1,
      ...req.body,
    };
    rents.push(newAccount);
  }
  fs.writeFileSync( 
    process.cwd(), 'database', 'rent_info.json',
    JSON.stringify(rents, null, 2)
  );
  res
    .json({
      message: "Ma'lumot yozildi!",
      status: 201,
    })
    .status(201);
};

module.exports = {
  GET_ACCOUNT_ID,
  POST,
};
