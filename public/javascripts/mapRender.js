const smallBackground = `images/backgrounds_small`;
const largeBackground = `images/backgrounds_full`;
var promiseOfAllImages = function (tiles) {
  const totalImg = tiles.length-1;
  let prefix = "";
  if (totalImg<100){
    prefix = smallBackground;
  }else{
    prefix = largeBackground;
  }
  let currentImg = 0;
  return Promise.all(
    tiles.map(function (t) {
      return new Promise(function (resolve) {
        var img = new Image();
        img.src = prefix+"/"+t.mapID+".jpg";
        console.log("loaded - "+prefix+"/"+t.mapID+".jpg");
        var posX = t.posX;
        var posY = t.posY;
        img.onload = function () {
          console.log("Loaded " + currentImg + "/" + totalImg);
          currentImg++;
          resolve({background: img, x: posX, y: posY});
        };
        img.onerror  = function () {
          var myUrl = "images/coffee.png";
          var img2 = new Image();
          img2.src = myUrl;
          img2.onload = function () {
            console.log("ERROR FOR: " + t.mapID);
            currentImg++;
            resolve({background: img2, x: posX, y: posY});
          }
        }
      });
    })
  );
};

function mapRender(mapsToRender){
  var canvas = document.getElementById("myCanvas")
  var ctx = canvas.getContext("2d")
  console.log(mapsToRender.hilo)
  var differenceX = Math.abs(mapsToRender.hilo.loX - mapsToRender.hilo.hiX);
  var differenceY = Math.abs(mapsToRender.hilo.loY - mapsToRender.hilo.hiY);
  if (mapsToRender.hilo.loX < -20 && mapsToRender.hilo.loY < -20){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width/2,canvas.height/2);
  }
  var ratioX = (1000/differenceX);
  var ratioY = (680/differenceY);
  ctx.clearRect(canvas.width/2*-1, canvas.height/2, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  function draw(images){
    for(var i = 0; i < images.length; i++){
      ctx.drawImage(images[i].background,images[i].x*ratioX,(images[i].y*ratioY),ratioX, ratioY);
    }
  }
  promiseOfAllImages(mapsToRender.maps)
  .then(function (allImages) {
    console.log("All images are loaded!", allImages); // [Img, Img, Img]
    draw(allImages);
  });
}
