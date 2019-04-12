const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + '/views/partials');

const clientId = 'eccc2c86866d45c0bffb795b31557a58',
    clientSecret = '28f63242cc9041bfa385240518ed4c19';

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
    })
    .catch(error => {
        console.log('Something went wrong when retrieving an access token', error);
    });

// the routes go here:
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/artists', (req, res) => {
    const query = req.query.artistName;
    spotifyApi
        .searchArtists(query)
        .then(data => {
            let art = data.body.artists.items;

            art = art.map(el => {
                return { name: el.name, image: el.images[0] && el.images[0].url, id: el.id };
            });

            res.render('artists', {
                art
            });
            console.log('The received data from the API: ');
        })
        .catch(err => {
            console.log('The error while searching artists occurred: ', err);
        });

    app.get('/albums/:artistId', (req, res) => {
        const { artistId } = req.params;
        spotifyApi
            .getArtistAlbums(artistId)
            .then(data => {
                let alb = data.body.artists.items;

                alb = alb.map(el => {
                    return { name: el.name, image: el.images[0] && el.images[0].url, id: el.id };
                });
                res.render('albums', { alb });
                console.log('The received data from the API: ', data.body.items[0]);
                // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            })
            .catch(err => {
                console.log('The error while searching artists occurred: ', err);
            });
    });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
