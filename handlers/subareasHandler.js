const axios = require('axios');
const ASSETS_ROOT_URL = 'https://proxyconnection.touch.dofus.com/data/map?lang=fr&v=2.19.0b';

  for (var i = 0; i < array.length; i++) {
    array[i]
  }

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
  }
};
