const express = require('express')
var bodyParser = require('body-parser')
let app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // support json encoded bodies
const port = 3000
const fs = require('fs');
var moment = require('moment-timezone')
let dateFormatFull = 'DD/MM/YYYY - hh:mm:ss A'
const filename = 'notification.json'

app.get('/notification', (req, res) => {
  let rawdata = fs.readFileSync(filename);
  let notification = JSON.parse(rawdata);
  let data = {}
  if (req.query.accountId) {
    data = {
      status: 'ok',
      notifications: notification
    }
  } else {
    data = {
      status: 'error',
      message: 'Sample custom error'
    }
  }
  
  res.send(data)
})

app.post('/notification', (req, res) => {
  let rawdata = fs.readFileSync(filename);
  let notification = JSON.parse(rawdata);
  let data = {}
  if (req.body.accountId || req.body.message) {
    let idx = notification.length > 0 ? notification.length - 1 :notification.length
    let lastId = notification[idx].id
    let newId = parseInt(lastId) + 1  
     // Use of Date.now() function 
    var date = moment(Date.now())
    let addValue = {
      "id": newId,
      "date": date.tz('Asia/Manila'),
      "message": req.body.message,
      "read": false
    }
    notification.push(addValue)
    let data = JSON.stringify(notification, null, 2);

    fs.writeFile(filename, data, (err) => {
        if (err) {
          throw err;
        } else {
          data = {
            status: 'ok'
          }
          res.send(data)
        } 
    });
  } else {
    data = {
      status: 'error',
      message: 'Sample custom error'
    }
    res.send(data)
  }
})

app.post('/notification/read/:id', (req, res) => {
  let rawdata = fs.readFileSync(filename);
  let notification = JSON.parse(rawdata);
  let data = {}
  if (req.params.id) {
    notification.forEach(function(x) {
      if (x.id === parseInt(req.params.id)) {
        x.read = true;
      }
    });
    let data = JSON.stringify(notification, null, 2);
    fs.writeFile(filename, data, (err) => {
        if (err) {
          throw err;
        } else {
          data = {
            status: 'ok'
          }
          res.send(data)
        } 
    });
  } else {
    data = {
      status: 'error',
      message: 'Sample custom error'
    }
    res.send(data)
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))