// app.get('/refresh_token', function(req, res) {
//    // requesting access token from refresh token
//    refresh_token = req.query.refresh_token;
//    var authOptions = {
//       url: 'https://accounts.spotify.com/api/token',
//       headers: {
//          'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
//       },
//       form: {
//          grant_type: 'refresh_token',
//          refresh_token: refresh_token
//       },
//       json: true
//    };
//
//    request.post(authOptions, function(error, response, body) {
//       if (!error && response.statusCode === 200) {
//          access_token = body.access_token;
//          res.send({
//             'access_token': access_token
//          });
//       }
//    });
// });
