const fs = require('fs');
const request = require('request');
const axios = require('axios');
const sharp = require('sharp');

const ASSETS_ROOT_URL = 'https://ankama.akamaized.net/games/dofus-tablette/assets/2.19.0';
module.exports = {
  downloadMaps: async function(allMaps) {
    downloadAllImages(allMaps)
      .then(function(allImages) {
        console.log("All images are loaded!", allImages);
      });
  }
}

async function downloadImage(map) {
  return new Promise(resolve => {
  const url_dl = `${ASSETS_ROOT_URL}/backgrounds/${map.mapID}.jpg`;
  console.log("trying to get: "+url_dl);
  const outputFilename = './public/images/backgrounds_full/' + map.mapID + '.jpg';
  const outputFilenameSmall = './public/images/backgrounds_small/' + map.mapID + '.jpg';
  if (fs.existsSync(outputFilename) && fs.existsSync(outputFilenameSmall)) {
      console.log(`File: ${map.mapID} already exists.`);
      resolve(map.mapID);
  }
  return axios.request({
    responseType: 'arraybuffer',
    url: url_dl,
    method: 'get',
    headers: {
      'Content-Type': 'image/jpeg',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 7.0; SM-G930VC Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36',
    },
  }).then((result) => {
    fs.writeFileSync(outputFilename, result.data);
    sharp(result.data)
      .resize(100, 68)
      .toFile(outputFilenameSmall, (err, info) => {
        if (err) {
          console.log(err);
        } else if (info) {
          console.log(`Image: ${map.mapID} resized to: ${info.width}x${info.height}`);
        }
      });
    console.log("downloaded at: " + outputFilename);
      resolve(outputFilename);
    });

  });
}

var downloadAllImages = async function(tiles) {
  const totalImg = tiles.length - 1;
  console.log("Needing to DL: " + tiles.length + " backgrounds");
  let currentImg = 0;
  return Promise.all(
    tiles.map(function(t) {
      return new Promise(function(resolve) {
        downloadImage(t).then(response => {
          console.log("background " + currentImg + "/" + totalImg + " --- " + response.data);
          currentImg++;
          resolve({
            image: currentImg - 1
          });
        });
      });
    })
  );
};
