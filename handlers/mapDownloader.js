var fs = require('fs');
request = require('request');

function downloadMaps(allMaps){
  for (var i = 0; i < allMaps.length; i++) {
    allMaps[i]
  }
  downloadAllImages(mapsToRender.maps)
  .then(function (allImages) {
    console.log("All images are loaded!", allImages); // [Img, Img, Img]
    draw(allImages);
  });
}

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

var downloadAllImages = function (tiles) {
  var totalImg = tiles.length-1;
  var currentImg = 0;
  return Promise.all(
    tiles.map(function (t) {
      return new Promise(function (resolve) {
            resolve({background: img2, x: posX, y: posY});
      });
    })
  );
};
