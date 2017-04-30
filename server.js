const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

PORT = process.env.PORT || 8080;

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.use('*', function(req, res) {
    res.status(404).json({ message: 'Not Found' });
});

const wakeHerokuApps = () => {
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
            console.log(response) 
          }
        })
    })
    
}

const checkTime = () => {
    const now = String(new Date())
    const UDT_hr = Number(now.slice(11, 13))

    //PST 5 - 20 is UDT 12pm - 3am => UDT 0-3 && 12-24
    if (UDT_hr <= 3 || UDT_hr >=12) {
        //every day, from 12 pm to 3 am, wake Herokuapp every hr.
        //3600000 = 1hr
        setInterval(wakeHerokuApps, 3600000);
    }
}

//checkTime every 15 minutes
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
