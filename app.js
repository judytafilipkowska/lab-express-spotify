require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// middleware for parsing the json and form- data request 

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));  

// Our routes go here:


app.get("/", (req, res) => {
    res.render('homepage')
});

app.get("/artist-search-results", (req, res) => {
    const artistSearch = req.query.artist;
    spotifyApi.searchArtists(artistSearch)
        .then((data) => {
            console.log("The received data from the API: ", data.body.artists.items);
            res.render('artist-search-results', {data: data.body.artists.items});
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch((err) =>
            console.log("The error while searching artists occurred: ", err)
        );
       
app.get('/albums/:artistId', (req, res) => {
  const artistId = req.params.artistId
     spotifyApi.getArtistAlbums(artistId)
        .then((data) => {
              console.log('Artist albums', data.body.items);
              res.render("albums", {albums: data.body.items});
           
            })
        .catch((err) => {
              console.error(err);
        })
         });
          
      });
      app.listen(3000, () =>
        console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
      );
