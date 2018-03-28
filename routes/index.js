var express = require('express');
var router = express.Router();
var axios = require('axios');
var origin = 88212247;
var map = {id:88212247, x:0, y:0, topNeighbourId:00000001, bottomNeighbourId:00000002,leftNeighbourId:00000003, leftNeighbourId:00000004};
/* GET home page. */
router.get('/', function(req, res, next) {
  getLine(origin, res)
});

const getLine = (id, res) => {
  axios.get('https://ankama.akamaized.net/games/dofus-tablette/assets/2.18.3/maps/'+id+'.json')
  .then(response => {
    console.log(response.data.url);
    console.log(response.data);
    const myimage = "https://ankama.akamaized.net/games/dofus-tablette/assets/2.18.3/backgrounds/"+origin+".jpg";
    res.render('index', { title: 'Dofus Discovery', json: response.data, myimg: myimage});
  })
  .catch(error => {
    console.log(error);
  });
};

module.exports = router;
