Game.UIMode = {};
Game.UIMode.DEFAULT_COLOR_FG = '#000';
Game.UIMode.DEFAULT_COLOR_BG = '#fff';

Game.UIMode.gameStart = {
  enter: function(){
    console.log("Start: enter");
  },
  exit: function(){
    console.log("Start: exit");
  },
  handleInput: function(eventType, evt){
    console.log("Start: handleInput");
    if (evt.keyCode==13){
      console.log("...switch to persistence");
      Game.switchUIMode(Game.UIMode.gamePersistence);
    } else if (evt.keyCode==76){
      Game.UIMode.gamePersistence.restoreGame();
    }
    else if (evt.keyCode==78){
      Game.UIMode.gamePersistence.newGame();
    }
  },
  renderOnMain: function(display){
    Game.DISPLAYS.main.o.drawText(2, 2, "Game Start!");
    Game.DISPLAYS.main.o.drawText(2, 3, "N for new game.  L to load.");
  }
};
Game.UIMode.gamePlay = {
  attr: {
    _map: null,
    _mapWidth: 300,
    _mapHeight: 200,
    _cameraX: 100,
    _cameraY: 100,
    _avatar: null,
    _numEnts: 200,
  },
  enter: function(){
    console.log("enter Play");
    Game.DISPLAYS.main.o.clear();
    Game.DISPLAYS.main.o.drawText(2, 2, "YOU ARE PLAYING THE GAME.");
    Game.renderAll();
  },
  exit: function(){
    console.log("exit");
  },
  handleInput: function(eventType, evt){
    console.log("handleInput");
    if (evt.keyCode==80){
      console.log("Switch to persistence");
      Game.switchUIMode(Game. xUIMode.gamePersistence);
    } else if (evt.keyCode==38){
      console.log("Move up");
      this.moveAvatar(0, -1);
    } else if (evt.keyCode==40){
      console.log("Move down");
      this.moveAvatar(0, 1);
    } else if (evt.keyCode==37){
      console.log("Move left");
      this.moveAvatar(-1, 0);
    } else if (evt.keyCode==39){
      console.log("Move right");
      this.moveAvatar(1, 0);
    }
  },
  renderOnMain: function(display){
    display.clear();
    this.attr._map.renderOn(display, this.attr._cameraX, this.attr._cameraY);
    this.renderEntities(display);
    console.log("Play: renderOnMain");
  },
  renderEntities: function (display) {
    Game.Symbol.AVATAR.draw(display,this.attr._avatar.getX()-this.attr._cameraX+display._options.width/2,
                                    this.attr._avatar.getY()-this.attr._cameraY+display._options.height/2);
    for (entID in Game.ALL_ENTITIES){
      Game.ALL_ENTITIES[entID].draw(display, Game.ALL_ENTITIES[entID].getX()-this.attr._cameraX+display._options.width/2,
                                      Game.ALL_ENTITIES[entID].getY()-this.attr._cameraY+display._options.height/2);
    }
  },
  moveAvatar: function (dx, dy) {
    if (this.attr._avatar.tryWalk(this.attr._map,dx,dy)) {
      this.attr._avatar.setX(this.attr._avatar.getX()+dx);
      this.attr._avatar.setY(this.attr._avatar.getY()+dy);
      this.setCameraToAvatar();
    }
    this.moveEntities();
  },
  moveEntities: function(){

    Game.renderAll();
  },
  moveCamera: function (dx,dy) {
    this.setCamera(this.attr._cameraX + dx,this.attr._cameraY + dy);
  },
  setCamera: function (sx,sy) {
    this.attr._cameraX = Math.min(Math.max(0,sx),this.attr._mapWidth);
    this.attr._cameraY = Math.min(Math.max(0,sy),this.attr._mapHeight);
    Game.renderAll();
  },
  setCameraToAvatar: function () {
    this.setCamera(this.attr._avatar.getX(),this.attr._avatar.getY());
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

   //create avatar
   this.attr._avatar = new Game.Entity(Game.EntityTemplates.Avatar);

    // restore anything else if the data is available
    if (restorationData !== undefined && restorationData.hasOwnProperty(Game.UIMode.gamePlay.JSON_KEY)) {
      this.fromJSON(restorationData[Game.UIMode.gamePlay.JSON_KEY]);
      //RESTORE POSITIONS
    } else {
      this.attr._avatar.setPos(this.attr._map.getRandomWalkableLocation());
      for (var ecount = 0; ecount < this.attr._numEnts; ecount++) {
         var temp_entity = new Game.Entity(Game.EntityTemplates.Monster);
         temp_entity.setPos(this.attr._map.getRandomWalkableLocation());
     }
    }

    this.setCameraToAvatar();
  },

 toJSON: function() {
   return Game.UIMode.gamePersistence.BASE_toJSON.call(this);
 },
 fromJSON: function (json) {
   Game.UIMode.gamePersistence.BASE_fromJSON.call(this,json);
 },
 BASE_toJSON: function(state_hash_name) {
     var state = this.attr;
     if (state_hash_name) {
       state = this[state_hash_name];
     }
     var json = JSON.stringify(state);
     /*for (var at in state) {
       if (state.hasOwnProperty(at)) {
         if (state[at] instanceof Object && 'toJSON' in state[at]) {
           json[at] = state[at].toJSON();
         } else {
           json[at] = state[at];
         }
       }
     }*/
     return json;
   },
   BASE_fromJSON: function (json,state_hash_name) {
     var using_state_hash = 'attr';
     if (state_hash_name) {
       using_state_hash = state_hash_name;
     }
     this[using_state_hash] = JSON.parse(json);
    /* for (var at in this[using_state_hash]) {
       if (this[using_state_hash].hasOwnProperty(at)) {
         if (this[using_state_hash][at] instanceof Object && 'fromJSON' in this[using_state_hash][at]) {
           this[using_state_hash][at].fromJSON(json[at]);
         } else {
           this[using_state_hash][at] = json[at];
         }
       }
     }*/
   }
}

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
      console.log("...switch back to play");
      Game.switchUIMode(Game.UIMode.gamePlay);
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
       Game.UIMode.gamePlay.setupPlay(state_data)

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
