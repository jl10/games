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
