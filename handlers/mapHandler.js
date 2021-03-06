const axios = require('axios');
const ASSETS_ROOT_URL = 'https://ankama.akamaized.net/games/dofus-tablette/assets/2.21.0';
const DATA_ROOT_URL = "https://proxyconnection.touch.dofus.com/data/map?lang=fr&v=2.21.0b"
module.exports = {

  getMapData: async function (mapId) {
    const data = "https://proxyconnection.touch.dofus.com/data/map?lang=fr&v=2.19.0b"
    return axios.get(`${ASSETS_ROOT_URL}/maps/${mapId}.json`)
      .then(response => {
        return {
          ...response.data,
          neighbourIds: [
            response.data.leftNeighbourId,
            response.data.rightNeighbourId,
            response.data.topNeighbourId,
            response.data.bottomNeighbourId
          ]
        }
      })
      .catch(() => null);
  },

  getAllMapsId: async function () {
    return axios.post(`${DATA_ROOT_URL}`, {class:"MapCoordinates",ids:[]})
      .then(response => {
          var allMaps = [];
          for (var i = 0; i < Object.values(response.data).length; i++) {
            allMaps = allMaps.concat(Object.values(response.data)[i].mapIds);
          }
          allMaps = uniq_fast(allMaps);
          return allMaps
      })
      .catch(error => {
      console.log(error);});
  },
  getAllMapsCoord: async function (mapIds) {
    console.log("Getting info for: "+mapIds.length);
    return axios.post(`${DATA_ROOT_URL}`, {class:"MapPositions",ids:mapIds})
      .then(response => {
          var allMapsData = [];
          const totalMaps = Object.values(response.data).length;
          for (var i = 0; i < Object.values(response.data).length; i++) {
            var mapData = {mapID: Object.values(response.data)[i].id, posX: Object.values(response.data)[i].posX, posY: Object.values(response.data)[i].posY, worldMap: Object.values(response.data)[i].worldMap, background: `${ASSETS_ROOT_URL}/backgrounds/${Object.values(response.data)[i].id}.jpg`}
            process.stdout.clearLine();  // clear current text
            process.stdout.cursorTo(0);  // move cursor to beginning of line
            //console.log(mapData);
            var percent = ((i+1)/totalMaps*50).toFixed(2) ;
            var progress = "";
            for (var j = 0; j < 50; j++) {
              if (j <= percent) {
                progress = progress + "=";
              }else{
                progress = progress + "-";
              }
            }
            progress = "[" + progress + "]";
            process.stdout.write(progress + "   map "+i+"/"+totalMaps);
            allMapsData.push(mapData);
          }
          return allMapsData
      })
      .catch(error => {
      console.log(error);});
  },
  getEverything: async function () {
    try {
      const plop = await this.getAllMapsId();
      console.log("\n Plop (mapIds) length" + plop.length);
      let halfWayThough = Math.floor(plop.length / 2)
      let arrayFirstHalf = plop.slice(0, halfWayThough);
      let arraySecondHalf = plop.slice(halfWayThough, plop.length);
      let blob = await this.getAllMapsCoord(arrayFirstHalf);
      let blober = await this.getAllMapsCoord(arraySecondHalf);
      console.log("\n Blob (mapDatas) = " + blob.length);
      let final = blob.concat(blober);
      console.log("TOTAL: "+ final.length)
      return final
    } catch (e) {
      console.log(e);
    }
  }
};

function uniq_fast(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}
