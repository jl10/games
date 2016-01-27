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
    Game.DISPLAYS.main.o.drawText(2, 2, "You are Moss Def, a short-tempered computer science student and hip-hop mossician who one days wakes up in his brightly-lit outdoor music production dungeon to find himself in the midst of a hell beyond his wildest nightmares: his studio is entirely filled with various levels and forms of hostile moss.  These leafy greens are ruining your vibe and totally screwing with the atmossphere of your studio, and you must make the mosst of your situation by using your musical prowess to get rid of them.");
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
    _numEnts: 200,
    _timeout: null,
    _last10times: [1000,1000,1000,1000,1000, 1000, 1000, 1000, 1000, 1000,1000,1000,1000,1000,1000, 1000, 1000, 1000, 1000, 1000],
    _timeLastKill: 1388563404,
    _level: 1,
  },
  enter: function(){
    console.log("enter Play");
    Game.DISPLAYS.main.o.clear();
    Game.DISPLAYS.main.o.drawText(2, 2, "YOU ARE PLAYING THE GAME.");
    Game.renderAll();
  },
  exit: function(){
    console.log("exit");
    document.getElementById("bass").pause();
    document.getElementById("drums").pause();
    document.getElementById("voice").pause();
    document.getElementById("guitar").pause();
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
    } else if (evt.keyCode==32){
      this.waitAvatar();
    } else if (evt.keyCode==81){
      Game.switchUIMode(Game.UIMode.gameLose);
    } else if (evt.keyCode==87){
      Game.switchUIMode(Game.UIMode.gameWin);
    } else if (evt.keyCode==75){
      this.killAll();
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
  waitAvatar: function(){
    Game.Message.messageGenie("wait");
    this.moveEntities();
  },
  moveAvatar: function (dx, dy) {
    var d = new Date();
    var curTime = d.getTime();
    var timeSince = curTime - this.attr._timeout;
    this.attr._timeout = curTime;

    this.updateVolumes(timeSince);
    var oldPos = {x: this.attr._avatar.getX(), y: this.attr._avatar.getY()};
    var oldHp = this.attr._avatar.getCurHp();

    var timeout = timeSince > 5000;
    if (timeout){
      Game.Message.pushMessage("It took you " + timeSince + " ms to do something.");
      Game.Message.messageGenie("sleep");
    } else {

      if (this.attr._avatar.tryWalk(this.attr._map,dx,dy)) {
        this.attr._avatar.setX(this.attr._avatar.getX()+dx);
        this.attr._avatar.setY(this.attr._avatar.getY()+dy);
        this.setCameraToAvatar();
      }
    }

    if (this.attr._level == 2) this.moveEntities();
    else if (this.attr._level == 3) this.attackEntities();
    else this.sitEntities();

    if (this.attr._avatar.getX() != oldPos.x || this.attr._avatar.getY() != oldPos.y){
      this.attr._avatar.setCurHp(oldHp);
    } else if (this.attr._avatar.getCurHp() < oldHp){
      Game.Message.messageGenie("hurt");
    }
    this.updateAvatar();

    if (this.attr._avatar.getCurHp() <= 0){
      Game.switchUIMode(Game.UIMode.gameLose);
    } else if (Object.keys(Game.Data.ALL_ENTITIES).length <= 1) {
      this.attr._level++;
      if (this.attr._level > 3){
        Game.switchUIMode(Game.UIMode.gameWin);
      } else {
        Game.Message.pushMessage("You clear all the moss in this room; you feel your musical energy replenished.  You move on to the next room, where the moss is even worse than before.");
        Game.UIMode.gamePersistence.clear();
        Game.setRandomSeed(Math.floor(Math.random()*1000000));
        Game.UIMode.gamePlay.setupPlay(this.attr._level);
      }
    }
    Game.renderAll();
  },
  sitEntities: function(){
    console.log("sit");
    for (var ent in Game.Data.ALL_ENTITIES){
      if (ent != this.attr._avatar._entityID){
        //determine direction to move into dx and dy
        var dx, dy;
        dx =  Game.Data.ALL_ENTITIES[ent].getX() - this.attr._avatar.getX();
        dy = Game.Data.ALL_ENTITIES[ent].getY() - this.attr._avatar.getY() ;

        if (Math.abs(dx) < 2 && dy == 0){
          dx =  dx*(-1);
          console.log("combat x");
        } else if (Math.abs(dy) < 2 && dx == 0){
          dy = dy*(-1);
          console.log("combat y");
        } else {
          dx = 0;
          dy = 0;
        }
        //try walking in direction
        if ((dx!= 0 && dy != 0) || Game.Data.ALL_ENTITIES[ent].tryWalk(this.attr._map,dx,dy)) {
          Game.Data.ALL_ENTITIES[ent].setX(Game.Data.ALL_ENTITIES[ent].getX()+dx);
          Game.Data.ALL_ENTITIES[ent].setY(Game.Data.ALL_ENTITIES[ent].getY()+dy);
        }
      }
    }
    Game.renderAll();
  },
  moveEntities: function(){
    for (var ent in Game.Data.ALL_ENTITIES){
      if (ent != this.attr._avatar._entityID){
        //determine direction to move into dx and dy
        var dx, dy;
        dx =  Game.Data.ALL_ENTITIES[ent].getX() - this.attr._avatar.getX();
        dy = Game.Data.ALL_ENTITIES[ent].getY() - this.attr._avatar.getY() ;

        if (Math.abs(dx) < 2 && dy == 0){
          dx =  dx*(-1);
          console.log("combat x");
        } else if (Math.abs(dy) < 2 && dx == 0){
          dy = dy*(-1);
          console.log("combat y");
        } else {
          var rand = ROT.RNG.getUniform();
          if (rand > 0.5){
            dy = 0;
            if (dx != 0) dx = dx/(Math.abs(dx));
          } else {
            dx = 0;
            if (dy != 0) dy = dy/(Math.abs(dy));
          }
        }

        //try walking in direction
        if (Game.Data.ALL_ENTITIES[ent].tryWalk(this.attr._map,dx,dy)) {
          Game.Data.ALL_ENTITIES[ent].setX(Game.Data.ALL_ENTITIES[ent].getX()+dx);
          Game.Data.ALL_ENTITIES[ent].setY(Game.Data.ALL_ENTITIES[ent].getY()+dy);
        }
      }
    }
    Game.renderAll();
  },
  attackEntities: function(){
    for (var ent in Game.Data.ALL_ENTITIES){
      if (ent != this.attr._avatar._entityID){
        //determine direction to move into dx and dy
        var dx, dy;
        dx =   this.attr._avatar.getX() - Game.Data.ALL_ENTITIES[ent].getX();
        dy =  this.attr._avatar.getY() - Game.Data.ALL_ENTITIES[ent].getY();

        var rand = ROT.RNG.getUniform();
        if (rand > 0.5){
          dy = 0;
          if (dx != 0) dx = dx/(Math.abs(dx));
        } else {
          dx = 0;
          if (dy != 0) dy = dy/(Math.abs(dy));
        }

        //try walking in direction
        if (Game.Data.ALL_ENTITIES[ent].tryWalk(this.attr._map,dx,dy)) {
          Game.Data.ALL_ENTITIES[ent].setX(Game.Data.ALL_ENTITIES[ent].getX()+dx);
          Game.Data.ALL_ENTITIES[ent].setY(Game.Data.ALL_ENTITIES[ent].getY()+dy);
        }
      }
    }

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
  updateAvatar: function() {
    Game.DISPLAYS.avatar.o.clear();
    Game.DISPLAYS.avatar.o.drawText(2, 2, "Groove level: " + this.attr._avatar.getCurHp());

  },
  setupPlay: function (level) {
    this.attr._level = level;

    this.loadSongs();

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

    console.log("CREATE NEW STUFF");
    //create avatar
    this.attr._avatar = new Game.Entity(Game.EntityTemplates.Avatar);
    this.attr._avatar.setPos(this.attr._map.getRandomWalkableLocation());

    //generate mosnters
    if (this.attr._level == 1) numMon = 50;
    else if (this.attr._level == 2) numMon = 75;
    else numMon = 100;
    for (var ecount = 0; ecount < numMon; ecount++) {
      var temp_entity = new Game.Entity(Game.EntityTemplates.Monster);
      temp_entity.setPos(this.attr._map.getRandomReachableLocation());

      //Delete overlaid duplicates
      for (var ent in Game.Data.ALL_ENTITIES){
        if (ent!= temp_entity._entityID && Game.Data.ALL_ENTITIES[ent].getX() == temp_entity.getX() && Game.Data.ALL_ENTITIES[ent].getY() == temp_entity.getY())
        delete Game.Data.ALL_ENTITIES[temp_entity._entityID];
      }
    }

    /*for (var ecount = 0; ecount < 100; ecount++) {
    var loc = this.attr._map.getRandomReachableLocation()

    var dup = false;
    //avoid overlaid duplicates
    for (var ent in Game.Data.ALL_ENTITIES){
    if (Game.Data.ALL_ENTITIES[ent].getX() == loc.x && Game.Data.ALL_ENTITIES[ent].getY() == loc.y){
    dup = true;
  }
}
if (!dup){
var temp_entity = new Game.Entity(Game.EntityTemplates.Monster);
temp_entity.setPos(loc);
}
}*/

  this.setCameraToAvatar();
  this.updateAvatar();
  if (level == 1) Game.switchUIMode(Game.UIMode.gamePlay);
},
killAll: function(){
  for (var ent in Game.Data.ALL_ENTITIES){
    if (Game.Data.ALL_ENTITIES[ent].getName()!="avatar") delete Game.Data.ALL_ENTITIES[ent];
  }
  this.moveAvatar(1, 0);
},
loadSongs: function(){
  if (this.attr._level == 1) {
    document.getElementById("bass").src = "http://www.zanorg.net/multitrack/dire_sultans/basse.mp3";
    document.getElementById("drums").src = "http://www.zanorg.net/multitrack/dire_sultans/batterie.mp3";
    document.getElementById("voice").src = "http://www.zanorg.net/multitrack/dire_sultans/voix.mp3";
    document.getElementById("guitar").src = "http://www.zanorg.net/multitrack/dire_sultans/extra.mp3";
  } else if (this.attr._level == 2){
    document.getElementById("bass").src = "http://www.zanorg.net/multitrack/rhcp_give/basse.mp3";
    document.getElementById("drums").src = "http://www.zanorg.net/multitrack/rhcp_give/batterie.mp3";
    document.getElementById("voice").src = "http://www.zanorg.net/multitrack/rhcp_give/voix.mp3";
    document.getElementById("guitar").src = "http://www.zanorg.net/multitrack/rhcp_give/guitare.mp3";
  } else if (this.attr._level == 3) {
    document.getElementById("bass").src = "http://www.zanorg.net/multitrack/village_ymca/basse.mp3";
    document.getElementById("drums").src = "http://www.zanorg.net/multitrack/village_ymca/batterie.mp3";
    document.getElementById("voice").src = "http://www.zanorg.net/multitrack/village_ymca/voix.mp3";
    document.getElementById("guitar").src = "http://www.zanorg.net/multitrack/village_ymca/extra.mp3";
  }

  document.getElementById("bass").load();
  document.getElementById("drums").load();
  document.getElementById("voice").load();
  document.getElementById("guitar").load();
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
    if (Game._curUIMode != Game.UIMode.gameLose){
      Game.switchUIMode(Game.UIMode.gameLose);
    }
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
    document.getElementById("voice").volume = 0;
  } else if (avgTime > 150) {
    document.getElementById("bass").volume = 1;
    document.getElementById("drums").volume = 1;
    document.getElementById("voice").volume = 0;
  } else {
    document.getElementById("bass").volume = 1;
    document.getElementById("drums").volume = 1;
    document.getElementById("voice").volume = 1;
  }

  var d = new Date();
  if (d.getTime() - this.attr._timeLastKill < 3000){
    document.getElementById("guitar").volume = 1;
  } else {
    document.getElementById("guitar").volume = 0;
  }
}
};

Game.UIMode.gameLose = {
  enter: function(){
    console.log("enter lose");
    Game.DISPLAYS.main.o.clear();
    Game.DISPLAYS.main.o.drawText(2, 2, Game.Message.randMessage("lose"));
    Game.DISPLAYS.main.o.drawText(2, 16, "Press N to start a new game.");
  },
  exit: function(){
    console.log("exit");
  },
  handleInput: function(eventType, evt){
    if (evt.keyCode==78){
      Game.UIMode.gamePersistence.newGame();
    }
  },
  renderOnMain: function(display){
    console.log("renderOnMain");
  }
};
Game.UIMode.gameWin = {
  enter: function(){
    Game.DISPLAYS.main.o.clear();
    Game.DISPLAYS.main.o.drawText(2, 2, Game.Message.randMessage("win"));
    Game.DISPLAYS.main.o.drawText(2, 16, "Press N to start a new game.");
  },
  exit: function(){
    console.log("exit");
  },
  handleInput: function(eventType, evt){
    if (evt.keyCode==78){
      Game.UIMode.gamePersistence.newGame();
    }
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
    Game.DISPLAYS.main.o.drawText(2, 3, "Press P to unpause, N for new game.");
  },
  exit: function(){
    console.log("exit");
    Game.UIMode.gamePlay.playSongs();
  },
  handleInput: function(eventType, evt){
    console.log("handleInput");
    if (evt.keyCode==78){
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
  newGame: function() {
    Game.UIMode.gamePersistence.clear();
    Game.setRandomSeed(Math.floor(Math.random()*1000000));
    Game.UIMode.gamePlay.setupPlay(1);
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
