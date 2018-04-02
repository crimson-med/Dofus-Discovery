const axios = require('axios');
const ASSETS_ROOT_URL = 'https://ankama.akamaized.net/games/dofus-tablette/assets/2.19.0';
const DATA_ROOT_URL = "https://proxyconnection.touch.dofus.com/data/map?lang=fr&v=2.19.0b"
module.exports = {
  getWorlds: async function () {
    return axios.post(`${DATA_ROOT_URL}`, {class:"worldMaps",ids:[]})
      .then(response => {
          return response.data
      })
      .catch(error => {
      console.log(error);});
  }
};
