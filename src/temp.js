const { booksDummy } = require('./booksDummy')

const response = (booksByQuery) => {
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

const name = 'dicoding'
let booksByQuery = booksDummy

if (name !== undefined) {
  booksByQuery = booksDummy.filter((b) => b.name.toLowerCase().includes(name.toLowerCase()))
}

console.log(response(booksByQuery))

// let booksByQuery = allBooks; // saya mengambil seluruh buku terlebih dahulu

// if (name !== undefined) {
//   booksByQuery = allBooks
//     .filter((entry) => entry.name.toLowerCase().includes(queryName.toLowerCase()));
// }

// if (reading !== undefined) {
//   booksByQuery = allBooks
//     .filter((entry) => entry.reading === (reading === '1'));
// }

// if (finished !== undefined) {
//   booksByQuery = allBooks
//     .filter((entry) => entry.finished === (finished === '1'));
// }

// // pemroses booksByQuery ke dalam bentuk response
