const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

PORT = process.env.PORT || 8080;

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('common'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.use('*', function(req, res) {
    res.status(404).json({ message: 'Not Found' });
});

const wakeHerokuApps = () => {
    console.log(2)

    var request = require('request');
    const urls = [
        'https://virtual-flashcards.herokuapp.com',
        'https://diye.herokuapp.com',
        'https://bill-split-app.herokuapp.com',
        'https://is-it-getting-hotter.herokuapp.com',
        'https://cryptic-atoll-29351.herokuapp.com' //jump phaser game
    ]
    urls.forEach(url => {
        request(url,  (error, response, body) => {
          if (!error && response.statusCode == 200) {
            console.log(body) 
          }
        })
    })
    
}

setInterval(wakeHerokuApps, 3600000); //every hour


let server;

function runServer(port = PORT) {
    return new Promise((resolve, reject) => {
            server = app
                .listen(port, () => {
                    console.log(`Your app is listening on port ${port}`);
                    resolve();
                })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
    });
}
function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
