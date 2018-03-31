const axios = require('axios');
const ASSETS_ROOT_URL = 'https://ankama.akamaized.net/games/dofus-tablette/assets/2.19.0';

module.exports = {
  getAllMaps: async function (startMapId, maxNumberOfMaps) {
    // Queue of map ids awaiting to be visited (breadth-first search)
    let pendingQueue = [startMapId];
    // List of maps that have been visited
    let visited = [];

    while (pendingQueue.length > 0 /*&& visited.length < maxNumberOfMaps*/) {
      // Pop a map id from the top of the queue
      const headMapId = pendingQueue.shift();
      // Fetch the data for that map
      const mapData = await getMapData(headMapId);

      try {
        if (mapData.id){
          process.stdout.clearLine();  // clear current text
          process.stdout.cursorTo(0);  // move cursor to beginning of line
          process.stdout.write("Current map: "+mapData.id+"  ---  # Visited maps: "+visited.length);  // write text
        }
      } catch (e) {

      } finally {

      }

      if (mapData !== null) {
        mapData.neighbourIds.forEach(neighbourId => {
          if (pendingQueue.indexOf(neighbourId) === -1 && !visited.some(m => m.id == neighbourId)) {
            pendingQueue.push(neighbourId);
          }
        });
        visited.push(mapData);
      }
    }
    return visited;
  },

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
    const data = "https://proxyconnection.touch.dofus.com/data/map?lang=fr&v=2.19.0b"
    return axios.post(`${data}`, {class:"MapCoordinates",ids:[]})
      .then(response => {
          var allMaps = [];
          console.log(Object.values(response.data).length);
          for (var i = 0; i < Object.values(response.data).length; i++) {
            allMaps.concat(Object.values(response.data)[i].mapIds);
          }
          return allMaps = a.filter(function(item, pos, self) {
            return self.indexOf(item) == pos;
          })
      })
      .catch(error => {
      console.log(error);});
  },
  getAllMapsId: async function (mapIds) {
    const data = "https://proxyconnection.touch.dofus.com/data/map?lang=fr&v=2.19.0b"
    return axios.post(`${data}`, {class:"MapPositions",ids:mapIds})
      .then(response => {
          var allMapsData = [];
          const totalMaps = Object.values(response.data).length;
          for (var i = 0; i < Object.values(response.data).length; i++) {
            var mapData = {mapID: Object.values(response.data)[i].id, posX: Object.values(response.data)[i].posX, posY: Object.values(response.data)[i].posY}
            process.stdout.clearLine();  // clear current text
            process.stdout.cursorTo(0);  // move cursor to beginning of line
            console.log(mapData);
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
  }
};
