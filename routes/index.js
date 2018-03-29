var express = require('express');
var router = express.Router();
var axios = require('axios');
var origin = 88212247;
var map = {id:88212247, x:0, y:0, topNeighbourId:00000001, bottomNeighbourId:00000002,leftNeighbourId:00000003, rightNeighbourId:00000004 background: ''};
var NSLine = [];
var Corigin = [0,0];

// New style
var visitedNodes= [];
var tovisitNodes = [];
var currentNode = {};
var previousNode = {};
var nexter = 0;
/* GET home page. */
router.get('/', function(req, res, next) {
  axios.get('https://ankama.akamaized.net/games/dofus-tablette/assets/2.18.3/maps/'+origin+'.json')
  .then(response => {
    nexter = response.data.leftNeighbourId;
    const myimage = "https://ankama.akamaized.net/games/dofus-tablette/assets/2.18.3/backgrounds/"+response.data.id+".jpg";
    var mapdata = {id: origin, x:0, y:0, topNeighbourId:response.data.topNeighbourId, bottomNeighbourId: response.data.bottomNeighbourId, leftNeighbourId:response.data.leftNeighbourId, rightNeighbourId:response.data.rightNeighbourId, background:myimage};
    console.log("#1");
    visitedNodes.push(mapdata);
    var toVisit = [
      {id: topNeighbourId, x:mapdata.x, y:mapdata.y-1},
      {id: bottomNeighbourId, x:mapdata.x, y:mapdata.y+1},
      {id: rightNeighbourId, x:mapdata.x+1, y:mapdata.y}
    ];
    tovisitNodes.push(toVisit);
    currentNode = {id: leftNeighbourId, x:mapdata.x-1, y:mapdata.y};
    previousNode = mapdata;
    pathMapping(res);
  })
  .catch(error => {
    //console.log(error);
  });
});

async function pathMapping(res) {
    while (tovisitNodes.length != 0) {
      await visitNode();
    }
    render('index', { title: 'Dofus Discovery', json: NSLine});
}
function visitNode(){
  return new Promise((resolve, reject) => {
    axios.get('https://ankama.akamaized.net/games/dofus-tablette/assets/2.18.3/maps/'+currentNode.id+'.json')
    .then(response => {
      visitedNodes.push(previousNode);
      const myimage = "https://ankama.akamaized.net/games/dofus-tablette/assets/2.18.3/backgrounds/"+response.data.id+".jpg";
      var mapdata = {id: currentNode.id, x:currentNode.x, y:currentNode.y, topNeighbourId:response.data.topNeighbourId, bottomNeighbourId: response.data.bottomNeighbourId, leftNeighbourId:response.data.leftNeighbourId, rightNeighbourId:response.data.rightNeighbourId, background: myimage};
      visitedNodes.push(mapdata);
      var toVisit = [
        {id: topNeighbourId, x:mapdata.x, y:mapdata.y-1},
        {id: bottomNeighbourId, x:mapdata.x, y:mapdata.y+1},
        {id: rightNeighbourId, x:mapdata.x+1, y:mapdata.y}
      ];
      // ADD IF NO DUPLICATES
      checkAndAddArr(toVisit);
      currentNode = {id: leftNeighbourId, x:mapdata.x-1, y:mapdata.y};
      previousNode = mapdata;
      resolve();
    })
    .catch(error => {
      if(error.response.status == 404){
        visitedNodes.push(previousNode);
        remove_duplicates(visitedNodes, tovisitNodes);
        currentNode = tovisitNodes[0];
        tovisitNodes.shift();
        // GO TO NEXT TOVISITNODE
        console.log("Hit a wall");
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
            if (a[i].name === b[j].name) {
                b.splice(j, 1);
                len2=b.length;
            }
        }
    }
}

/*
function myAsyncFunctionDown(id) {
  return new Promise((resolve, reject) => {
    axios.get('https://ankama.akamaized.net/games/dofus-tablette/assets/2.18.3/maps/'+id+'.json')
    .then(response => {
      //console.log(response.data.id);
      Corigin[1]++;
      const myimage = "https://ankama.akamaized.net/games/dofus-tablette/assets/2.18.3/backgrounds/"+response.data.id+".jpg";
      var mapdata = {id: id, x:0, y:Corigin[1], topNeighbourId:response.data.topNeighbourId, bottomNeighbourId: response.data.bottomNeighbourId, leftNeighbourId:response.data.leftNeighbourId, rightNeighbourId:response.data.rightNeighbourId, background: myimage};
      //console.log(mapdata);
      if(mapdata != null){
        NSLine.push(mapdata);
      }
      //console.log('next map: '+ response.data.topNeighbourId);
      nexter = response.data.bottomNeighbourId;
      resolve();
    })
    .catch(error => {
      console.log(error.url);
      resolve();
      //reject(error);
    });
  });
}
*/

module.exports = router;
