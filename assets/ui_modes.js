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
    Game.DISPLAYS.main.o.drawText(2, 2, "You are Moss Def, a short-tempered computer science student and hip-hop mossician who one days wakes up in his brightly-lit outdoor music production dungeon to find himself in the midst of a hell beyond his wildest nightmares: his studio is entirely filled with various levels and forms of hostile moss.  These leafy greens are ruining your vibe, and you must make the mosst of your situation.  Use your musical prowess to get rid of them.");
    Game.DISPLAYS.main.o.drawText(2, 16, "Depress the button that says 'N' to begin.");
  }
};
Game.UIMode.gamePlay = {
  attr: {
    _map: null,
    _mapWidth: 100,
    _mapHeight: 100,
    _cameraX: 100,
    _cameraY: 100,
    _avatar: null,
    _numEnts: 400,
    _timeout: null,
    _last10times: [1000,1000,1000,1000,1000, 1000, 1000, 1000, 1000, 1000,1000,1000,1000,1000,1000, 1000, 1000, 1000, 1000, 1000],
    _timeLastKill: 1388563404,
  },
  enter: function(){
    console.log("enter Play");
    Game.DISPLAYS.main.o.clear();
    Game.DISPLAYS.main.o.drawText(2, 2, "YOU ARE PLAYING THE GAME.");
    Game.renderAll();
  },
  exit: function(){
    console.log("exit");
    document.getElementById("bass").load();
    document.getElementById("drums").load();
    document.getElementById("voice").load();
    document.getElementById("guitar").load();
  },
  handleInput: function(eventType, evt){
    if (evt.keyCode==80){
      console.log("Switch to persistence");
      Game.switchUIMode(Game.UIMode.gamePersistence);
    } else if (evt.keyCode==38){
      this.moveAvatar(0, -1);
    } else if (evt.keyCode==40){
      this.moveAvatar(0, 1);
    } else if (evt.keyCode==37){
      this.moveAvatar(-1, 0);
    } else if (evt.keyCode==39){
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
    for (var entID in Game.Data.ALL_ENTITIES){
      Game.Data.ALL_ENTITIES[entID].draw(display, Game.Data.ALL_ENTITIES[entID].getX()-this.attr._cameraX+display._options.width/2,
                                      Game.Data.ALL_ENTITIES[entID].getY()-this.attr._cameraY+display._options.height/2);
    }
  },
  moveAvatar: function (dx, dy) {
    var d = new Date();
    var curTime = d.getTime();
    var timeSince = curTime - this.attr._timeout;
    this.attr._timeout = curTime;

    this.updateVolumes(timeSince);

    var timeout = timeSince > 3000;
    if (timeout){
      Game.Message.pushMessage("It took you " + timeSince + " ms to do something.  Slowpoke.");
      Game.Message.pushMessage("You fell asleep, since you took so long.  It takes you a turn to wake from your slumber.")
    } else {

      if (this.attr._avatar.tryWalk(this.attr._map,dx,dy)) {
        this.attr._avatar.setX(this.attr._avatar.getX()+dx);
        this.attr._avatar.setY(this.attr._avatar.getY()+dy);
        this.setCameraToAvatar();
      }
    }
    this.moveEntities();

    if (this.attr._avatar.getCurHp <= 0){
      console.log("Switch to LOSE");
      Game.switchUIMode(Game.UIMode.gameLose);
    }
  },
  moveEntities: function(){

    Game.renderAll();
  },
  moveCamera: function (dx,dy) {
    this.setCamera(this.attr._cameraX + dx,this.attr._cameraY + dy);
  },
  setCamera: function (sx,sy) {
    console.log(sx + " " + sy);
    this.attr._cameraX = Math.min(Math.max(0,sx),this.attr._mapWidth);
    this.attr._cameraY = Math.min(Math.max(0,sy),this.attr._mapHeight);
    Game.renderAll();
  },
  setCameraToAvatar: function () {
    this.setCamera(this.attr._avatar.getX(),this.attr._avatar.getY());
  },
  setupPlay: function (restorationData) {
   setTimeout(this.playSongs, 2000);
   setInterval(function(){var d = new Date(); if (d.getTime() - Game.UIMode.gamePlay.attr._timeout > 3000) Game.UIMode.gamePlay.updateVolumes(3000);}, 3000);
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

   // Start timer
   var d = new Date();
   this.attr._timeout = d.getTime();

    // restore anything else if the data is available
    if (restorationData !== undefined) {
      //RESTORE POSITIONS
      console.log("LOAD STUFF")
      Game.Data.ALL_ENTITIES = {};
      for (var obj in restorationData.ALL_ENTITIES){
        Game.Data.ALL_ENTITIES[obj] = new Game.Entity(restorationData.ALL_ENTITIES[obj]);
        /*Game.Data.ALL_ENTITIES[obj] = new Game.Entity({
          _name: restorationData.ALL_ENTITIES[obj].attr._name,
          _chr: restorationData.ALL_ENTITIES[obj].attr._chr,
          _fg: restorationData.ALL_ENTITIES[obj].attr._fg,
          _x: restorationData.ALL_ENTITIES[obj].attr._x,
          _y: restorationData.ALL_ENTITIES[obj].attr._y,
          _maxHp: restorationData.ALL_ENTITIES[obj].attr._HitPoints_attr.curHp,
          _mixins: restorationData.ALL_ENTITIES[obj]._mixins,
        });*/

        if (restorationData.ALL_ENTITIES[obj].attr._name == 'avatar'){
          this.attr._avatar = Game.Data.ALL_ENTITIES[obj];
          this.attr._avatar.setPos({_x: Game.Data.ALL_ENTITIES[obj].attr._x, _y: Game.Data.ALL_ENTITIES[obj].attr._y});
        }
      }

    } else {
      console.log("CREATE NEW STUFF");
      //create avatar
      this.attr._avatar = new Game.Entity(Game.EntityTemplates.Avatar);
      this.attr._avatar.setPos(this.attr._map.getRandomWalkableLocation());


      for (var ecount = 0; ecount < 100; ecount++) {
         var temp_entity = new Game.Entity(Game.EntityTemplates.Monster);
         temp_entity.setPos(this.attr._map.getRandomReachableLocation());

         //Delete overlaid duplicates
         for (var ent in Game.Data.ALL_ENTITIES){
           if (ent!= temp_entity._entityID && Game.Data.ALL_ENTITIES[ent].getX() == temp_entity.getX() && Game.Data.ALL_ENTITIES[ent].getY() == temp_entity.getY())
            delete Game.Data.ALL_ENTITIES[temp_entity._entityID];
         }
     }
    }

    this.setCameraToAvatar();
  },
  playSongs: function(){
    document.getElementById("bass").play();
    document.getElementById("drums").play();
    document.getElementById("voice").play();
    document.getElementById("guitar").play();

    document.getElementById("bass").volume = 1;
    document.getElementById("drums").volume = 0;
    document.getElementById("voice").volume = 0;
    document.getElementById("guitar").volume = 0;
  },

  updateVolumes: function(timeSince){
    if (document.getElementById("bass").ended){
      console.log("Switch to LOSE");
      Game.switchUIMode(Game.UIMode.gameLose);
    }

    this.attr._last10times.shift();
    this.attr._last10times.push(timeSince);

    var sum = 0;
    for (var i = 0; i < 20; i++){
      sum += this.attr._last10times[i];
    }
    var avgTime = sum/20;
    if (avgTime > 250) {
      document.getElementById("bass").volume = 1;
      document.getElementById("drums").volume = 0;
      document.getElementById("guitar").volume = 0;
      console.log("BASS");
    } else if (avgTime > 150) {
      document.getElementById("bass").volume = 1;
      document.getElementById("drums").volume = 1;
      document.getElementById("guitar").volume = 0;
      console.log("DRUMS");
    } else {
      document.getElementById("bass").volume = 1;
      document.getElementById("drums").volume = 1;
      document.getElementById("guitar").volume = 1;
      console.log(avgTime);
    }

    var d = new Date();
    if (d.getTime() - this.attr._timeLastKill < 3000){
      document.getElementById("voice").volume = 1;
    } else {
      document.getElementById("voice").volume = 0;
    }
  }
};

Game.UIMode.gameLose = {
  enter: function(){
    console.log("enter lose");
    Game.DISPLAYS.main.o.clear();
    Game.DISPLAYS.main.o.drawText(2, 2, "You've exhausted all of your musical energy battling the viscious moss.  You're dead now...in spirit.");
    Game.DISPLAYS.main.o.drawText(2, 6, "Press N to start a new game.");
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
       var json_state_data = window.localStorage.getItem(Game.Data._PERSISTANCE_NAMESPACE);
       var state_data = JSON.parse(json_state_data);
       console.log(state_data);
       //RESTORE VARIABLES
       //Game._game = state_data;
       Game.setRandomSeed(state_data._randomSeed);
       /*Game.Data.ALL_ENTITIES = state_data.ALL_ENTITIES;
       Game.Data = state_data;
       console.log(state_data);*/
       Game.UIMode.gamePlay.setupPlay(state_data);


       Game.switchUIMode(Game.UIMode.gamePlay);
     }
  },
  saveGame: function(json_state_data) {
    if (this.localStorageAvailable()) {
    console.log("Save game");
    //Game.DATASTORE._game = Game._game;
   //  Game.DATASTORE.ALL_ENTITIES = Game.Data.ALL_ENTITIES;
     window.localStorage.setItem(Game.Data._PERSISTANCE_NAMESPACE, JSON.stringify(Game.Data)); // .toJSON()
     Game.DISPLAYS.message.o.drawText(0, 0, "Game saved.");
     console.log(Game.getRandomSeed());
   }
  },
  newGame: function() {
    Game.UIMode.gamePersistence.clear();
    Game.setRandomSeed(Math.floor(Math.random()*1000000));
    Game.UIMode.gamePlay.setupPlay();
    Game.switchUIMode(Game.UIMode.gamePlay);
  },
  clear: function() {
    Game.Data.ALL_ENTITIES={};
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
  },

};
