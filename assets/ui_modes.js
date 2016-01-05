Game.UIMode = {};

Game.UIMode.gameStart = {
  enter: function(){
    console.log("enter");
  },
  exit: function(){
    console.log("exit");
  },
  handleInput: function(eventType, evt){
    console.log("handleInput");
    Game.switchUIMode(Game.UIMode.gamePlay);
  },
  renderOnMain: function(display){
    Game.DISPLAYS.main.o.drawText(2, 2, "Game Start!");
    Game.DISPLAYS.main.o.drawText(2, 3, "Do something.");
  }
};
Game.UIMode.gamePlay = {
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
    console.log("enter");
  },
  exit: function(){
    console.log("exit");
  },
  handleInput: function(eventType, evt){
    console.log("handleInput");
  },
  render: function(display){
    console.log("renderOnMain");
  },
  restoreGame: function() {
    var json_state_data = '{"randomSeed":12}';
    var state_data = JSON.parse(json_state_data);
    Game.setRandomSeed(state_data.randomSeed);
    Game.switchUIMode(Game.UIMode.gamePlay);
  },
  saveGame: function(json_state_data){
    Game.switchUIMode(Game.UIMode.gamePlay);
  },
  newGame: function() {
    Game.setRandomSeed(Math.floor(Math.random()*1000000));
    Game.switchUImode(Game.UIMode.gamePlay);
  }
};
