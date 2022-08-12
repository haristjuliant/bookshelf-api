const Hapi = require('@hapi/hapi')
const routes = require('./routes')

const init = async () => {
  const server = Hapi.server({
    // ini untuk development tutorial fase awal kita bedakan antara production dan develpoment
    // karena di instance aws EC2, tidak dapat berjalan di localhost
    // host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*']
      }
    }
    // pengaturan CORS (Cross-Origin Resource Sharing) pada pembuatan server.
    // bisa dilakuakn di routes
  })

  server.route(routes)

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
  const today = new Date()
  console.log('restarted server at ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds())
}

init()
