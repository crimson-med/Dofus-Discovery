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
  //positionSort(config);
  //var toprocess = positionSort(config);
  //console.log ("in index with: " + config + " maps") ;
  //console.log(toprocess)
  config = getHiLo(config);
  res.render('index', { title: 'Dofus Discovery', json: positionSort(config)});
});

function getHiLo(worldMaps){
  for (var i = 0; i < Object.values(worldMaps).length; i++) {
    var lowestX = Number.POSITIVE_INFINITY;
    var highestX = Number.NEGATIVE_INFINITY;
    var tmpX;
    var lowestY = Number.POSITIVE_INFINITY;
    var highestY = Number.NEGATIVE_INFINITY;
    var tmpY;
    for (var j=Object.values(worldMaps)[i].maps.length-1; j>=0; j--) {
        tmpX = Object.values(worldMaps)[i].maps[j].posX;
        if (tmpX < lowestX) lowestX = tmpX;
        if (tmpX > highestX) highestX = tmpX;
        tmpY = Object.values(worldMaps)[i].maps[j].posY;
        if (tmpY < lowestY) lowestY = tmpY;
        if (tmpY > highestY) highestY = tmpY;
    }
    Object.values(worldMaps)[i].hilo = {hiX: highestX, hiY: highestY, loX: lowestX, loY: lowestY};
    console.log(Object.values(worldMaps)[i].hilo);
  }
  return worldMaps
}

function positionSort(worldMaps) {
  for (var i = 0; i < Object.values(worldMaps).length; i++) {
      Object.values(worldMaps)[i].maps.sort(sortNumber);
  }
  return worldMaps

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
