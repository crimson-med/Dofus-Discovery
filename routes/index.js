var express = require('express');
var router = express.Router();
var axios = require('axios');
var fs = require('fs');
var maps = require("./../app.js").maps;

var map = {id:88212247, x:0, y:0, topNeighbourId:00000001, bottomNeighbourId:00000002,leftNeighbourId:00000003, rightNeighbourId:00000004, background: ''};
var NSLine = [];
var Corigin = [0,0];

// New style
var visitedNodes= [];
var tovisitNodes = [];
var currentNode = {};
var previousNode = {};
var origin = 88212247;
var nexter = 0;
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log ("in index with: " + maps + "maps") ;
});

async function pathMapping(res) {
    while (tovisitNodes.length != 0) {
      await visitNode();
    }
    console.log(visitedNodes.length);
    fs.writeFile('maps.txt', JSON.stringify(visitedNodes), function (err) {
    if (err) throw err;
      console.log('It\'s saved! in same location.');
    });
    res.render('index', { title: 'Dofus Discovery', json: visitedNodes});
}
function visitNode(){
  return new Promise((resolve, reject) => {
    console.log("Trying to get: " + currentNode.x + "," + currentNode.y + "  --  mapID: " + currentNode.id);
    axios.get('https://ankama.akamaized.net/games/dofus-tablette/assets/2.18.3/maps/'+currentNode.id+'.json')
    .then(response => {
      const myimage = "https://ankama.akamaized.net/games/dofus-tablette/assets/2.18.3/backgrounds/"+currentNode.id+".jpg";
      var mapdata = {id: currentNode.id, x:currentNode.x, y:currentNode.y, topNeighbourId:response.data.topNeighbourId, bottomNeighbourId: response.data.bottomNeighbourId, leftNeighbourId:response.data.leftNeighbourId, rightNeighbourId:response.data.rightNeighbourId, background: myimage};
      visitedNodes.push(mapdata);
      var toVisit = [
        {id: response.data.topNeighbourId, x:mapdata.x, y:mapdata.y-1},
        {id: response.data.bottomNeighbourId, x:mapdata.x, y:mapdata.y+1},
        {id: response.data.rightNeighbourId, x:mapdata.x+1, y:mapdata.y}
      ];
      checkAndAddArr(toVisit);
      //console.log("visitedNodes: "+visitedNodes.length+"  ---  tovisitNodes: "+tovisitNodes.length);
      //process.stdout.clearLine();  // clear current text
      //process.stdout.cursorTo(0);  // move cursor to beginning of line
      //i = visitedNodes.length;
      //var dots = new Array(i + 1).join(".");
      //process.stdout.write("visitedNodes: "+visitedNodes.length+"  ---  tovisitNodes: "+tovisitNodes.length);  // write text
      currentNode = {id: response.data.leftNeighbourId, x:mapdata.x-1, y:mapdata.y};
      previousNode = mapdata;
      remove_duplicates(visitedNodes, tovisitNodes);
      resolve();
    })
    .catch(error => {
      if(error.response.status == 404){
        //visitedNodes.push(previousNode);
        currentNode = tovisitNodes[0];
        console.log("-- HIT A WALL at -- " + previousNode.x + "," + previousNode.y + "  --  mapID: " +currentNode.id);
        console.log("-- STARTING at -- " + tovisitNodes[0].x + "," + tovisitNodes[0].y + "  --  mapID: " +currentNode.id);
        tovisitNodes.shift();
        remove_duplicates(visitedNodes, tovisitNodes);
        resolve();
        //reject(error);
      }
    });
  });
}

function checkAndAddArr(toAdd) {
  for (var i = 0; i < toAdd.length; i++) {
    var id = tovisitNodes.length + 1;
    var found = tovisitNodes.some(function (el) {
      return el.id === toAdd[i].id;
    });
    if (!found) { tovisitNodes.push(toAdd[i]); }
  }
}

function remove_duplicates(a, b) {
    for (var i = 0, len = a.length; i < len; i++) {
        for (var j = 0, len2 = b.length; j < len2; j++) {
            if (a[i].id === b[j].id) {
                b.splice(j, 1);
                len2=b.length;
            }
        }
    }
}

module.exports = router;
