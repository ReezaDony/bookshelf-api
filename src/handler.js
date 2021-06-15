/* eslint-disable max-len */
const { nanoid } = require('nanoid');
const books = require('./books');

// handler menambah buku
const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  // menambah data buku
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  // validasi input tambah buku
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    })
      .code(400);
    return response;
  }

  if (pageCount < readPage) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    })
      .code(400);
    return response;
  }
  // menambahkan data buku
  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    })
      .code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  })
    .code(500);
  return response;
};
// handle ambil data buku
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name !== undefined) {
    books.filter((showBookName) => showBookName.name.toLowerCase().includes(name.toLowerCase()));
  } else if (reading !== undefined) {
    books.filter((showBook) => showBook.reading === !!Number(reading));
  } else if (finished !== undefined) {
    books.filter((showFinished) => showFinished.reading === !!Number(finished));
  }

  const response = h
    .response({
      status: 'success',
      data: {
        books: books.map((dataBook) => ({
          id: dataBook.id,
          name: dataBook.name,
          publisher: dataBook.publisher,
        })),
      },
    })
    .code(200);
  return response;
};
// handle ambil data buku byId
const getBooksByIdHandler = (request, h) => {
  const { id } = request.params;
  const matchingId = books.filter((idMatch) => idMatch.id === id)[0];

  if (matchingId !== undefined) {
    return {
      status: 'success',
      data: {
        book: matchingId,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  })
    .code(404);
  return response;
};
// handle edit data buku byId
const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const bookIdIndex = books.findIndex((bookMatch) => bookMatch.id === id);

  if (bookIdIndex !== -1) {
    const {
      name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;

    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
        .code(400);
      return response;
    }

    if (pageCount < readPage) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
        .code(400);
      return response;
    }
    // update data buku
    const updatedAt = new Date().toISOString();

    books[bookIdIndex] = {
      ...books[bookIdIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    })
      .code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  })
    .code(404);
  return response;
};
// handle hapus buku byId
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const matchingId = books.findIndex((book) => book.id === id);

  if (matchingId !== -1) {
    books.splice(matchingId, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    })
      .code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  })
    .code(404);
  return response;
};

module.exports = {
  addBookHandler, getAllBooksHandler, getBooksByIdHandler, editBookByIdHandler, deleteBookByIdHandler,
};
