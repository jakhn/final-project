const fs = require('fs');

const GET = (req, res) => {
  let book = fs.readFileSync(process.cwd() + '/database/book.json', 'UTF-8');
  book = JSON.parse(book);
  res.json(
    book.filter(el => {
      checkIsbn = req.query.isbn ? el.isbn == req.query.isbn : true;
      checkGender = req.query.gender ? el.gender == req.query.gender : true;
      checkTitle = req.query.title ? el.title == req.query.title : true;
      checkAuthor = req.query.author ? el.title == req.query.author : true;
      checkDescription = req.query.description
        ? el.description == req.query.description
        : true;
      checkPublishYear = req.query.publish_year
        ? el.publish_year == req.query.publish_year
        : true;
      checkCoverPhotoURL = req.query.cover_photo_url
        ? el.cover_photo_url == req.query.cover_photo_url
        : true;

      return (
        checkIsbn &&
        checkTitle &&
        checkAuthor &&
        checkPublishYear &&
        checkGender &&
        checkDescription &&
        checkCoverPhotoURL
      );
    })
  );
};

const GET_ID = (req, res) => {
  let book = fs.readFileSync(process.cwd() + '/database/book.json', 'UTF-8');
  book = JSON.parse(book);
  res.json(book.find(el => el.id == req.params.id));
};

const POST = (req, res) => {
  if (!req.body) {
    return res
      .json({
        message: "Body'dan ma'lumot kelmadi",
        status: 400,
      })
      .status(400);
  }
  const {
    isbn,
    gender,
    title,
    author,
    description,
    publish_year,
    cover_photo_url,
  } = req.body;

 
  if (
    !title ||
    !author ||
    !description ||
    !isbn ||
    !gender ||
    !publish_year ||
    !cover_photo_url
  ) {
    return res.json({
      message: "Malumot to'liq emas!",
      status: 400,
    });
  }
  let book = fs.readFileSync(process.cwd() + '/database/book.json', 'UTF-8');
  book = book ? JSON.parse(book) : [];
  req.body.id = book.length ? book[book.length - 1].id + 1 : 1;
  book.push(req.body);
  fs.writeFileSync(
    process.cwd() + '/database/book.json',
    JSON.stringify(book, null, 2)
  );
  res.json({
    message: "Ma'lumot yozildi",
    status: 201,
    data: req.body,
  });
};

const PUT = (req, res) => {
  if (!req.params.id) {
    return res.json({
      message: 'Id parametrdan kiritilmadi!',
      status: 400,
    });
  }
  let book = fs.readFileSync(process.cwd() + '/database/book.json', 'UTF-8');
  book = book ? JSON.parse(book) : [];

  let findBook = book.find(el => el.id == req.params.id);
  if (!findBook) {
    return res.json({
      message: req.params.id + " ushbu id'li kitob database'da mavjud emas!",
      status: 404,
    });
  }

  const {
    isbn,
    gender,
    title,
    author,
    publish_year,
    description,
    cover_photo_url,
  } = req.body;

  findBook.isbn = isbn ? isbn : findBook.isbn;
  findBook.gender = gender ? gender : findBook.gender;
  findBook.cover_photo_url = cover_photo_url
    ? cover_photo_url
    : findBook.cover_photo_url;
  findBook.title = title ? title : findBook.title;
  findBook.description = description ? description : findBook.description;
  findBook.author = author ? author : findBook.author;
  findBook.publish_year = publish_year ? publish_year : findBook.publish_year;

  fs.writeFileSync(
    process.cwd() + '/database/book.json',
    JSON.stringify(book, null, 2)
  );

  return res.json({
    message: "Ma'lumot o'zgartirildi!",
    status: 200,
  });
};

const DELETE = (req, res) => {
  if (!req.params.id) {
    return res.json({
      message: 'Id parametrdan kiritilmadi!',
      status: 400,
    });
  }
  let book = fs.readFileSync(process.cwd() + '/database/book.json', 'UTF-8');
  book = book ? JSON.parse(book) : [];

  let findBookIndex = book.findIndex(el => el.id == req.params.id);
  if (findBookIndex == -1) {
    return res.json({
      message: req.params.id + " ushbu id'li kitob database'da mavjud emas!",
      status: 404,
    });
  }

  book.splice(findBookIndex, 1);

  fs.writeFileSync(
    process.cwd() + '/database/book.json',
    JSON.stringify(book, null, 2)
  );

  return res.json({
    message: "Ma'lumot o'chirildi!",
    status: 200,
  });
};

module.exports = {
  GET,
  POST,
  PUT,
  DELETE,
  GET_ID,
};
