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
  var config = req.app.get('maps');
  //var toprocess = positionSort(config);
  //console.log ("in index with: " + config + " maps") ;
  //console.log(toprocess)
  res.render('index', { title: 'Dofus Discovery', json: JSON.stringify(positionSort)});
});

function positionSort(worldMaps) {

  for (var i = 0; i < Object.values(worldMaps).length; i++) {
      Object.values(worldMaps)[i].maps.sort(sortNumber);
    //Object.values(gameWorlds)[i].maps.filter(map => map.posX == (i+1) && map.worldMap >= 0 );
    /*for (var j = 0; j < Object.values(gameWorlds)[i].maps.length; j++) {
      console.log(Object.values(gameWorlds)[i].maps[j]);

    }*/
  }

}

function sortNumber(a,b) {
  return a.posY - b.posY || a.posX - b.posX;
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
