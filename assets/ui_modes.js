Game.UIMode = {};

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
      Game.switchUIMode(Game.UIMode.gamePlay);

    }
  },
  renderOnMain: function(display){
    Game.DISPLAYS.main.o.drawText(2, 2, "Game Start!");
    Game.DISPLAYS.main.o.drawText(2, 3, "Press P to pause, Enter to start.");
  }
};
Game.UIMode.gamePlay = {
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
  },
  renderOnMain: function(display){
    console.log("renderOnMain");
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
    Game.DISPLAYS.main.o.drawText(2, 3, "Press S to save, L to load.");
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
  },
  render: function(display){
    console.log("renderOnMain");
  },
  restoreGame: function() {
    if (this.localStorageAvailable()) {
      console.log("Restore game");
       var json_state_data = window.localStorage.getItem(Game._PERSISTANCE_NAMESPACE);
       var state_data = JSON.parse(json_state_data);
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
    Game.switchUImode(Game.UIMode.gamePlay);
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
