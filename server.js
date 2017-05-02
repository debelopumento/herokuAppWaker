
const express = require('express');
const cors = require('cors');

PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.use('*', function(req, res) {
    res.status(404).json({ message: 'Not Found' });
});
var request = require('request');

const wakeHerokuApps = () => {
    const urls = [
        'https://virtual-flashcards.herokuapp.com',
        'https://diye.herokuapp.com',
        'https://bill-split-app.herokuapp.com',
        'https://is-it-getting-hotter.herokuapp.com',
        'https://cryptic-atoll-29351.herokuapp.com', //jump phaser game
        'https://heroku-app-poker.herokuapp.com/'
    ]
    urls.forEach(url => {
        request(url,  (error, response, body) => {
            console.log('poking ', url) 
          if (!error && response.statusCode == 200) {
            console.log('successfully poked ', url)
          }
        })
    })
}

const checkTime = () => {
    const now = new Date()
    console.log(1, new Date())
    const nowString = String(now)
    const UDT_hr = Number(nowString.slice(16, 18))
    console.log(10, now, 11, nowString, 12, UDT_hr)
    //PST 5 - 20 is UDT 12pm - 3am => UDT 0-3 && 12-24
    if (UDT_hr < 3 || UDT_hr >=12) {
        console.log('nowString: ', nowString, ', UDT_hr: ', UDT_hr, ', poking apps.')
        //every day, from 12 pm to 3 am, wake Herokuapp.
        wakeHerokuApps()
    } else {
        console.log('nowString: ', nowString, ', UDT_hr: ', UDT_hr, 'Off hour. Apps are asleep.')
        selfUrl = 'https://heroku-app-poker.herokuapp.com/'
        request(selfUrl, (err, response, body) => {
            console.log('poking self')
        })
    }
}

//checkTime every 15 minutes
wakeHerokuApps()
checkTime()
const interval = 1000 * 60 * 15
setInterval(checkTime, interval)

let server;

function runServer(port = PORT) {
    return new Promise((resolve, reject) => {
            server = app
                .listen(port, () => {
                    console.log(`Your app is listening on port ${port}`);
                    resolve();
                })
                .on('error', err => {
                    reject(err);
                });
    });
}
function closeServer() {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
