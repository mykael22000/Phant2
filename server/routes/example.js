export default function (server) {

  server.route({
    path: '/api/Phant2/example',
    method: 'GET',
    handler(req, reply) {
      reply({ time: (new Date()).toISOString() });
    }
  });

}
