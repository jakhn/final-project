const BASE_URL = 'http://localhost:8000';

const tableBodyNode = document.querySelector('tbody');
const rowTemplateNode = document.querySelector('template');
const modalNode = document.querySelector('.modal');
const modalFormNode = modalNode.querySelector('form');

const addBookButton = document.querySelector('.add-book');
const modalAddButton = modalNode.querySelector('.add');
const modalUpdateButton = modalNode.querySelector('.update');

const modal = new bootstrap.Modal(modalNode);

let books = []; 

const getRemoteBooks = async () => {
  return await fetch(BASE_URL + '/book').then((res) => res.json());
};

const updateRemoteBooks = async (data, method) => {
  return await fetch(`${BASE_URL}/book`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(Object.fromEntries(data)),
  });
};

const drawBooks = (books) => {
  // clean table before inserting new rows
  tableBodyNode.innerHTML = '';

  books.forEach((book, index) => {
    const { id, title, isbn, author, publish_year, cover_photo_url } = book;

    const row = document.importNode(rowTemplateNode.content, true);

    row.querySelector('.number').textContent = index + 1;
    row.querySelector('.image').src = cover_photo_url;
    row.querySelector('.title').textContent = title;
    row.querySelector('.author').textContent = author;
    row.querySelector('.isbn').textContent = isbn;
    row.querySelector('.published').textContent = publish_year;

    row
      .querySelector('.delete')
      .addEventListener('click', () => handleDeleteButtonClick(id));
    row
      .querySelector('.edit')
      .addEventListener('click', () => handleUpdateButtonClick(id));

    tableBodyNode.appendChild(row);
  });
};

const updateBooksList = async () => {
  books = await getRemoteBooks(); // save in global variable
  drawBooks(books);
};

//event handlers
function addBook() {
  const data = new FormData(modalFormNode);

  fetch(`${BASE_URL}/book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(Object.fromEntries(data)),
  }).then(() => {
    modal.hide();
    updateBooksList();
  });
}

function updateBook() {
  const id = modalFormNode.name;
  const data = new FormData(modalFormNode);

  fetch(`${BASE_URL}/book/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(Object.fromEntries(data)),
  }).then(() => {
    modal.hide();
    updateBooksList();
  });
}

function handleDeleteButtonClick(id) {
  const bookToDelete = books.find((book) => book.id === id);

  const hasConfirmed = confirm(
    `Are you sure, you want to delete a book with title "${bookToDelete.title}"`
  );

  if (hasConfirmed) {
    fetch(BASE_URL + '/book/' + id, {
      method: 'DELETE',
    }).then(updateBooksList);
  }
}

function handleUpdateButtonClick(id) {
  // hide add button and show update
  modalUpdateButton.classList.remove('d-none');
  modalUpdateButton.classList.add('d-flex');
  modalAddButton.classList.remove('d-flex');
  modalAddButton.classList.add('d-none');

  const bookToEdit = books.find((book) => book.id === id);
  for (key in bookToEdit) {
    if (key in modalFormNode.elements) {
      modalFormNode.elements[key].value = bookToEdit[key];
    }
  }
  modalFormNode.name = bookToEdit.id;

  modal.show();
}

//Set event handlers
modalAddButton.addEventListener('click', addBook);
modalUpdateButton.addEventListener('click', updateBook);

// reset form values on modal close https://getbootstrap.com/docs/5.0/components/modal/
modalNode.addEventListener('hidden.bs.modal', () => {
  modalFormNode.reset();
});

addBookButton.addEventListener('click', () => {
  // hide update button and show add
  modalUpdateButton.classList.remove('d-flex');
  modalUpdateButton.classList.add('d-none');
  modalAddButton.classList.remove('d-none');
  modalAddButton.classList.add('d-flex');
  modal.show();
});

//initialize books
updateBooksList();
