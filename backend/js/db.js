const {
   Client
} = require('pg')

const client = new Client({
   user: 'postgres',
   host: 'counter-1.c4fxt0ukb7r1.us-east-2.rds.amazonaws.com',
   database: 'counter',
   password: 'counterDBpassword',
   port: 5432,
})
client.connect()


module.exports = {
   newUser: function(email, username, password, platforms, created_on, last_login) {
      query = `INSERT INTO account (email, username, password, platforms, created_on, last_login)
               VALUES ('${email}', '${username}','${password}','${platforms}',now(),now())
               ON CONFLICT (email)
               DO UPDATE SET email='${email}', username='${username}',password='${password}',platforms='${platforms}',created_on=now(),last_login=now();`
      // console.log(query);
      client.query(query, function(err, res) {
         if (err) {
            console.log('DB: error adding user');
            console.log(err)
         }
      })
   },
   getTokens: function(email, callback) {
      query = `SELECT refresh_token, access_token from account where email = '${email}';`
      // console.log(query);
      client.query(query, function(err, res) {
         if (!err) {
            callback(res.rows[0].access_token, res.rows[0].refresh_token);
         } else {
            console.log('DB: error getting tokens');
            console.log(err)
         }
      })
   },
   setTokens: function(email, access, refresh) {
      query = `UPDATE account SET refresh_token='${refresh}', access_token='${access}' WHERE email='${email}';`
      // console.log(query);
      client.query(query, function(err, res) {
         if (err) {
            console.log('DB: error setting tokens');
            console.log(err)
         }
      })
   },
   login: function(email) {
      query = `UPDATE account SET last_login=now() WHERE email='${email}';`
      client.query(query, function(err, res) {
         if (err) {
            console.log('DB: error updating login time');
            console.log(err)
         }
      })
   },
   listen: function(email, tracks) {
      innerquery = ''
      for(i = 0; i < tracks.items.length; i++){
         curr = tracks.items[i]
         track = curr.track;
         artists = ''
         for(j = 0; j < track.artists.length; j++){
            artists += track.artists[j].name;
         }
         console.log(JSON.stringify(track.name))
         //curr.played_at
         if(i == 0){
            innerquery = `(DEFAULT,'${email}','${prep(artists)}','${prep(track.album.name)}','${prep(track.name)}','${trep(track.album.release_date)}','spotify','${track.id}','${curr.played_at}')`
         } else {
            innerquery += `, (DEFAULT,'${email}','${prep(artists)}','${prep(track.album.name)}','${prep(track.name)}','${trep(track.album.release_date)}','spotify','${track.id}','${curr.played_at}')`
         }
      }
      query = `INSERT INTO listen (listen_id, email, artists, album, title, released_on, platform, platform_trackID, listened_on)
               VALUES ${innerquery}
               on conflict (email, listened_on) do nothing;`
      // console.log(query);
      client.query(query, function(err, res) {
         if (err) {
            console.log('DB: error listening to track');
            console.log(err)
         }
      })
   }
};

function prep(txt){
   return txt.replace(/'/g, '');
}

function trep(txt){
   if(txt.length == 4){
      return txt+'-12-12'
   }else{
      return txt;
   }
}
