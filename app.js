require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,  //dotenv -> process.env (to get credentials from the file.)
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
//1. create index route, render view index.hbs, create form with artistName field, redirect to /artist-search with queryString http://localhost:3000/artist-search="whatever1892163"

app.get('/', (req, res) => {
    res.render('index');
  });

app.get('/artist-search', async (req, res) => {
    
    const {artistName} = req.query; // or req.query.artistName

    const data = await spotifyApi.searchArtists(artistName)  // or searchyadayada(req.query.artistName)
    // console.log(data.body.artists);
    const allArtists = data.body.artists.items;

//   .then(data => {
//     console.log('The received data from the API: ', data.body.artists.items[0].images);
//     // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
//     res.render('artist-search-results', {data});
//   })
//   .catch(err => console.log('The error while searching artists occurred: ', err));

    res.render('artist-search-results', {allArtists});
  });

app.get('/albums/:artistID', async (req, res) => {
    const response = await spotifyApi.getArtistAlbums(req.params.artistID);
    // console.log(response.body.items[0]);
    const allAlbums = response.body.items;
    res.render('albums', {allAlbums: allAlbums});
 });

app.get('/tracks/:albumID', async (req, res) => {
    const response = await spotifyApi.getAlbumTracks(req.params.albumID);
    // console.log(response.body.items);
    const allTracks = response.body.items;
    res.render('tracks', {allTracks});
 });


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
