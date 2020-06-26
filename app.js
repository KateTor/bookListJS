// Book Constructor - handles the actual book object
function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

// UI Constructor - set of prototype methods
function UI() {};

// get local storage
UI.prototype.getBooks = function () {
    let books;
    if (localStorage.getItem('books') === null) {
        books = [];
    } else {
        books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
}

// display local storage
UI.prototype.displayBooks = function () {
    const ui = new UI;
    const books = ui.getBooks();

    books.forEach(function (book) {
        ui.addBookToList(book);
    })
}

// add to local storage
UI.prototype.storeBookInLocalStorage = function (book) {
    const ui = new UI;
    const books = ui.getBooks();
    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
}

// delete from local storage
UI.prototype.deleteFromLS = function (isbn) {
    const ui = new UI;
    const books = ui.getBooks();
    books.forEach(function (book, index) {

        if (book.isbn === isbn) {
            books.splice(index, 1);
        }
    });

    localStorage.setItem('books', JSON.stringify(books));

}


UI.prototype.addBookToList = function (book) {
    const ui = new UI;
    const list = document.getElementById('book-list');
    // create element table row
    const row = document.createElement('tr');
    // insert columns
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class = "delete">X</a></td>
    `;

    list.appendChild(row);
}

//show alert
UI.prototype.showAlert = function (message, className) {
    // create div
    const div = document.createElement('div');
    //add classes, including the one being passed in
    div.className = `alert ${className}`;
    // create text using message passed in
    div.appendChild(document.createTextNode(message));
    //get parent element to append to
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    // first name what you want to insert then what you want to insert before
    container.insertBefore(div, form);
    setTimeout(function () {
        document.querySelector('.alert').remove();
    }, 3000);
}

//delete book
UI.prototype.deleteBook = function (target) {
    const ui = new UI;
    if (target.className === 'delete') {
        target.parentElement.parentElement.remove();
        ui.showAlert('Book Removed', 'success');
    }
}

// clear fields
UI.prototype.clearFields = function () {
    document.getElementById('title').value = "";
    document.getElementById('author').value = "";
    document.getElementById('isbn').value = "";
}

// Event listeners for add
document.getElementById('book-form').addEventListener('submit', function (e) {
    // get form values
    const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

    //instantiate book
    const book = new Book(title, author, isbn);

    // instantiate UI
    const ui = new UI();

    // validate fields
    if (title === '' || author === '' || isbn === '') {
        //error alert, takes in 2 parameters, the message and the class
        ui.showAlert('Please fill in all fields', 'error');
    } else {
        //add book to list
        ui.addBookToList(book);
        ui.storeBookInLocalStorage(book);
        ui.showAlert('Book Added', 'success');

        //clear fields
        ui.clearFields();
    }

    e.preventDefault();
})

// event listener for delete
document.getElementById('book-list').addEventListener('click', function (e) {
    const ui = new UI();
    ui.deleteBook(e.target);
    ui.deleteFromLS(e.target.parentElement.previousElementSibling.textContent);
    e.preventDefault();
})

// list on load
document.addEventListener('DOMContentLoaded', function () {
    const ui = new UI();
    ui.displayBooks();
});