var express = require('express');
var router = express.Router();
var axios = require('axios');
var origin = 88212247;
var map = {id:88212247, x:0, y:0, topNeighbourId:00000001, bottomNeighbourId:00000002,leftNeighbourId:00000003, rightNeighbourId:00000004};
var nexter = 0;
var NSLine = [];
var Corigin = [0,0];
/* GET home page. */
router.get('/', function(req, res, next) {
  getLine(origin, res)
});

async function loop() {
    for (let i = 0; i < 10; i++) {
        await myAsyncFunction(id);
        console.log(i);
      }
}

function myAsyncFunction(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}

const getLine = (id, res) => {
  axios.get('https://ankama.akamaized.net/games/dofus-tablette/assets/2.18.3/maps/'+id+'.json')
  .then(response => {
    console.log(response.data.id);
    console.log(response.data.topNeighbourId);
    nexter = response.data.topNeighbourId;
    console.log('next map: '+ response.data.topNeighbourId);
    var mapdata = {id: id, x:0, y:0, topNeighbourId:response.data.topNeighbourId, bottomNeighbourId: response.data.bottomNeighbourId, leftNeighbourId:response.data.leftNeighbourId, rightNeighbourId:response.data.rightNeighbourId};
    NSLine.push(mapdata);
  })
  .catch(error => {
    console.log(error);
  });
 for (var i = 0; i < 3; i++) {
    axios.get('https://ankama.akamaized.net/games/dofus-tablette/assets/2.18.3/maps/'+nexter+'.json')
    .then(response => {
      console.log(response.data.id);
      Corigin[1]--;
      const myimage = "https://ankama.akamaized.net/games/dofus-tablette/assets/2.18.3/backgrounds/"+response.data.id+".jpg";
      var mapdata = {id: id, x:0, y:Corigin[1], topNeighbourId:response.data.topNeighbourId, bottomNeighbourId: response.data.bottomNeighbourId, leftNeighbourId:response.data.leftNeighbourId, rightNeighbourId:response.data.rightNeighbourId, background: myimage};
      NSLine.push(mapdata);
      nexter = response.data.topNeighbourId;
    })
    .catch(error => {
      console.log(error);
    });
  }

};

module.exports = router;
