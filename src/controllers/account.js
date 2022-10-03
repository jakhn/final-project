const fs = require("fs");


const GET = (req, res) => {
  let accounts = fs.readFileSync(process.cwd() + "/database/account.json", "UTF-8");
  accounts = JSON.parse(accounts);
  res.json(
    accounts.filter(el => {
      checkUsername = req.query.username ? el.username == req.query.username : true;
      checkFirstname = req.query.firstname ? el.firstname == req.query.firstname : true;
      checkLastname = req.query.lastname ? el.lastname == req.query.lastname : true;
      checkEmail = req.query.email ? el.email == req.query.email : true;
      checkAddress = req.query.address ? el.address == req.query.address : true;
      checkPhone = req.query.phone ? el.phone == req.query.phone : true;
      checkDateOfBirth = req.query.date_of_birth ? el.date_of_birth == req.query.date_of_birth : true;

      return checkUsername && checkFirstname && checkLastname && checkEmail && checkAddress && checkPhone && checkDateOfBirth;
    })
  );
};

const GET_ID = (req, res) => {
  let accounts = fs.readFileSync(process.cwd() + "/database/account.json", "UTF-8");
  accounts = JSON.parse(accounts);
  res.json(accounts.find(el => el.id == req.params.id));
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
  const { username, firstname, lastname, email, address, phone,date_of_birth } = req.body;
  if (!username || !firstname || !date_of_birth || !lastname || !email || !address || !phone) {
    return res.json ({
      message: "Malumot to'liq emas!",
      status:400,
    })
  }
  let accounts = fs.readFileSync(process.cwd() + "/database/account.json", "UTF-8");
  accounts = accounts ? JSON.parse(accounts) : [];
  req.body.id = accounts.length ? accounts[accounts.length - 1].id + 1 : 1;
  accounts.push(req.body);
  fs.writeFileSync(
    process.cwd() + "/database/account.json",
    JSON.stringify(accounts, null, 2)
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
      message: "Id parametrdan kiritilmadi!",
      status: 400,
    });
  }
  let accounts = fs.readFileSync(process.cwd() + "/database/account.json", "UTF-8");
  accounts = accounts ? JSON.parse(accounts) : [];

  let findAccount = accounts.find(el => el.id == req.params.id);
  if (!findAccount) {
    return res.json({
      message: req.params.id + " ushbu id'li account database'da mavjud emas!",
      status: 404,
    });
  }

  const { username, firstname, lastname, email, address, phone, date_of_birth } = req.body;

  findAccount.username = username ? username : findAccount.username;
  findAccount.firstname = firstname ? firstname : findAccount.firstname;
  findAccount.lastname = lastname ? lastname : findAccount.lastname;
  findAccount.email = email ? email : findAccount.email;
  findAccount.address = address ? address : findAccount.address;
  findAccount.phone = phone ? phone : findAccount.phone;
  findAccount.date_of_birth = date_of_birth ? date_of_birth : findAccount.date_of_birth; 
  
  fs.writeFileSync(
    process.cwd() + "/database/account.json",
    JSON.stringify(accounts, null, 2)
  );

  return res.json({
    message: "Ma'lumot o'zgartirildi!",
    status: 200,
  });
};

const DELETE = (req, res) => {
  if (!req.params.id) {
    return res.json({
      message: "Id parametrdan kiritilmadi!",
      status: 400,
    });
  }
  let accounts = fs.readFileSync(process.cwd() + "/database/account.json", "UTF-8");
  accounts = accounts ? JSON.parse(accounts) : [];

  let findAccountIndex = accounts.findIndex(el => el.id == req.params.id);
  if (findAccountIndex == -1) {
    return res.json({
      message: req.params.id + " ushbu id'li account database'da mavjud emas!",
      status: 404,
    });
  }

  accounts.splice(findAccountIndex, 1);

  fs.writeFileSync(
    process.cwd() + "/database/account.json",
    JSON.stringify(accounts, null, 2)
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
