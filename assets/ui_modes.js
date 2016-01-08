Game.UIMode = {};
Game.UIMode.DEFAULT_COLOR_FG = '#000';
Game.UIMode.DEFAULT_COLOR_BG = '#fff';
Game.UIMode.gameStart = {
  enter: function(){
    console.log("enter start");
  },
  exit: function(){
    console.log("exit");
  },
  handleInput: function(eventType, evt){
    console.log("handleInput");
    if (evt.keyCode==80){
      console.log("Switch to persistence");
      Game.switchUIMode(Game.UIMode.gamePersistence);
    }
    else if (evt.keyCode==13){
      Game.UIMode.gamePersistence.newGame();
    }
  },
  renderOnMain: function(display){
    Game.DISPLAYS.main.o.drawText(2, 2, "Game Start!");
    Game.DISPLAYS.main.o.drawText(2, 3, "Press P to pause, Enter to start.");
  }
};
Game.UIMode.gamePlay = {
  attr: {
    _map: null,
    _mapWidth: 300,
    _mapHeight: 200,
    _cameraX: 100,
    _cameraY: 100,
    _avatarX: 100,
    _avatarY: 100
  },
  enter: function(){
    console.log("enter Play");
    Game.DISPLAYS.main.o.clear();
    Game.DISPLAYS.main.o.drawText(2, 2, "YOU ARE PLAYING THE GAME.");
  },
  exit: function(){
    console.log("exit");
  },
  handleInput: function(eventType, evt){
    console.log("handleInput");
    if (evt.keyCode==80){
      console.log("Switch to persistence");
      Game.switchUIMode(Game.UIMode.gamePersistence);
      }
    },
  renderOnMain: function(display){
    this.attr._map.renderOn(display);
    console.log("renderOnMain");
  },
  setupPlay: function (restorationData) {
   var mapTiles = Game.util.init2DArray(this.attr._mapWidth,this.attr._mapHeight,Game.Tile.nullTile);
   var generator = new ROT.Map.Cellular(this.attr._mapWidth,this.attr._mapHeight);
   generator.randomize(0.5);

   // repeated cellular automata process
   var totalIterations = 3;
   for (var i = 0; i < totalIterations - 1; i++) {
     generator.create();
   }

   // run again then update map
   generator.create(function(x,y,v) {
     if (v === 1) {
       mapTiles[x][y] = Game.Tile.floorTile;
     } else {
       mapTiles[x][y] = Game.Tile.wallTile;
     }
   });

   // create map from the tiles
   this.attr._map =  new Game.Map(mapTiles);
   //this.renderOnMain(Game.DISPLAYS.main.o);
//   Game.renderMain();

   // restore anything else if the data is available
   if (restorationData !== undefined && restorationData.hasOwnProperty(Game.UIMode.gamePlay.JSON_KEY)) {
     this.fromJSON(restorationData[Game.UIMode.gamePlay.JSON_KEY]);
   }
 },
 toJSON: function() {
   var json = {};
   for (var at in this.attr) {
     if (this.attr.hasOwnProperty(at) && at!='_map') {
       json[at] = this.attr[at];
     }
   }
   return json;
 },
 fromJSON: function (json) {
   for (var at in this.attr) {
     if (this.attr.hasOwnProperty(at) && at!='_map') {
       this.attr[at] = json[at];
     }
   }
 }
};
Game.UIMode.gameLose = {
  enter: function(){
    console.log("enter");
  },
  exit: function(){
    console.log("exit");
  },
  handleInput: function(eventType, evt){
    console.log("handleInput");
  },
  renderOnMain: function(display){
    console.log("renderOnMain");
  }
};
Game.UIMode.gameWin = {
  enter: function(){
    console.log("enter");
  },
  exit: function(){
    console.log("exit");
  },
  handleInput: function(eventType, evt){
    console.log("handleInput");
  },
  renderOnMain: function(display){
    console.log("renderOnMain");
  }
};
Game.UIMode.gamePersistence = {
  enter: function(){
    console.log("enter persistence");
    Game.DISPLAYS.main.o.clear();
    Game.DISPLAYS.main.o.drawText(2, 2, "GAME PAUSED");
    Game.DISPLAYS.main.o.drawText(2, 3, "Press S to save, L to load, P to unpause, N for new game.");
  },
  exit: function(){
    console.log("exit");
  },
  handleInput: function(eventType, evt){
    console.log("handleInput");
    if (evt.keyCode==83){
      this.saveGame();
    }
    else if (evt.keyCode==76){
      this.restoreGame();
    }
    else if (evt.keyCode==78){
      this.newGame();
    }
    else if (evt.keyCode==80){
      console.log("Switch to persistence");
      Game.switchUIMode(Game.UIMode.gamePersistence);
    }
  },
  render: function(display){
    console.log("renderOnMain");
  },
  restoreGame: function() {
    if (this.localStorageAvailable()) {
      console.log("Restore game");
       var json_state_data = window.localStorage.getItem(Game._PERSISTANCE_NAMESPACE);
       var state_data = JSON.parse(json_state_data);

       //RESTORE VARIABLES
       Game.setRandomSeed(state_data._randomSeed);


       Game.switchUIMode(Game.UIMode.gamePlay);
       console.log(Game.getRandomSeed());
     }
  },
  saveGame: function(json_state_data) {
    if (this.localStorageAvailable()) {
    console.log("Save game");
     window.localStorage.setItem(Game._PERSISTANCE_NAMESPACE, JSON.stringify(Game._game)); // .toJSON()
     Game.DISPLAYS.message.o.drawText(0, 0, "Game saved.");
     console.log(Game.getRandomSeed());
   }
  },
  newGame: function() {
    Game.setRandomSeed(Math.floor(Math.random()*1000000));
    Game.UIMode.gamePlay.setupPlay();
    Game.switchUIMode(Game.UIMode.gamePlay);
  },
  localStorageAvailable: function () { // NOTE: see https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
  	try {
  		var x = '__storage_test__';
  		window.localStorage.setItem(x, x);
  		window.localStorage.removeItem(x);
  		return true;
  	}
  	catch(e) {
      Game.Message.send('Sorry, no local data storage is available for this browser');
  		return false;
  	}
  }
};
