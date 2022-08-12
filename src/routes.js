const {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBukuByIdHandler
} = require('./handler')

const routes = [
  // route menambahkan buku
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler
  },

  // melihat semua buku
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler
  },

  // melihat isi detail satu buku berdasarkan 'id'
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler
  },

  // mengubah isi detail buku
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIdHandler
  },

  // menghapus buku
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBukuByIdHandler
  }

]

module.exports = routes
