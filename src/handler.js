const { nanoid } = require('nanoid')
const books = require('./books')

// handler menambahkan buku baru
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  // random id by nanoid()
  const id = nanoid(8)
  // date of created notes dan diformat menjadi bentuk ISO String
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const finished = (pageCount === readPage)

  // membuat objek catatan baru berdasarkan value yang sudah ada
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
    updatedAt
  }

  // response error untuk nama buku yang kosong
  if (!newBook.name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  // response error readPage lebih besar dari pageCount
  if (newBook.readPage > newBook.pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  // memasukan array buku
  books.push(newBook)

  // apakah newNote sudah masuk dalam array notes. method filter() berdasarkan 'id' catatan.
  const isSuccess = books.filter((book) => book.id === id).length > 0

  // response berhasil
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }

  // response gagal / generic error
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

// handler untuk melihat semua Notes dan berdasarkan query tertentu
const getAllBooksHandler = (request, h) => {
  const {
    name,
    reading,
    finished
  } = request.query

  // hanya check, query masuk atau tidak
  // const today = new Date()
  // console.log(today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() + '\t| ' + name)

  // menyalin daftar buku yang kemudian di filter
  let booksByQuery = books

  /**
   * dengan if yang seperti ini, juga dapat digunakan multiple query
   * karena pencarian query nya case insensitive, maka antara query dan yang dicari dibandingkan setelah variabel semuanya diubah menjadi huruf kecil
   */

  // saring jika ada query nama
  if (name !== undefined) {
    booksByQuery = booksByQuery
      .filter((b) => b.name.toLowerCase().includes(name.toLowerCase()))
  }

  // saring jika ada query reading
  if (reading !== undefined) {
    booksByQuery = booksByQuery
      .filter((b) => b.reading === (reading === '1'))
  }

  // saring jika ada query finished
  if (finished !== undefined) {
    booksByQuery = books
      .filter((b) => b.finished === (finished === '1'))
  }

  // kesimpulan response
  return ({
    status: 'success',
    data: {
      // yang ditampilkan hanya id, name, publisher
      books: booksByQuery.map((b) => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher
      }))
    }
  }
  )
}

// handler melihat rincian buku berdasarkan 'id'
const getBookByIdHandler = (request, h) => {
  // id dari request client
  const { bookId } = request.params

  // mendapatkan objek book dengan 'id' yang dicari
  const book = books.filter((n) => n.id === bookId)[0]

  // mengembalikan objek book dan data nya
  // pastikan objek book tidak undefined yang berarti gagal atau tidak ketemu
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }

  // response fail
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

/**
 * {
    "name": string,
    "year": number,
    "author": string,
    "summary": string,
    "publisher": string,
    "pageCount": number,
    "readPage": number,
    "reading": boolean
}
 */

// handler menghapus isi detail buku
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  // cek payload nama apakah kosong
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  // cek readPage apakah melebihi pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const updatedAt = new Date().toISOString()
  const index = books.findIndex((n) => n.id === bookId)

  // jika berhasil dan  index = -1 jika tidak berhasil ditemukan
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }

  // jika gagal diperbaharui secara umum
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBukuByIdHandler = (request, h) => {
  const { bookId } = request.params
  // pencarian index buku dalam array books[]
  const index = books.findIndex((b) => b.id === bookId)

  if (index !== -1) {
    // delete array objek notes berdasarkan index
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBukuByIdHandler
}
