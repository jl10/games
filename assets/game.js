window.onload = function() {
    console.log("starting WSRL - window loaded");
    // Check if rot.js can work on this browser
    if (!ROT.isSupported()) {
        alert("The rot.js library isn't supported by your browser.");
    } else {
        // Initialize the game
        Game.init();

        // Add the containers to our HTML page
        document.getElementById('wsrl-main-display').appendChild(   Game.getDisplay('main').getContainer());
        document.getElementById('wsrl-avatar-display').appendChild(   Game.getDisplay('avatar').getContainer());
        document.getElementById('wsrl-message-display').appendChild(   Game.getDisplay('message').getContainer());
        Game.switchUIMode(Game.UIMode.gameStart);
    }
};

var Game = {
  DISPLAYS: {
    avatar: {
      w:  20,
      h: 24,
      o: null
    },
    main: {
      w:  80,
      h: 24,
      o: null
    },
    message: {
      w:  100,
      h: 6,
      o: null
    }
  },
  _game: null,
  _curUIMode: null,
  _randomSeed: 0,
  _PERSISTANCE_NAMESPACE: 'wsrlgame',
  init: function(){
    console.log("test");
    for (var displayName in this.DISPLAYS){
      if (this.DISPLAYS.hasOwnProperty(displayName)){
        this.DISPLAYS[displayName].o = new ROT.Display({width:this.DISPLAYS[displayName].w, height:this.DISPLAYS[displayName].h});
      }
    }

    window.addEventListener('keypress', function(evt){Game.eventHandler('keypress', evt);});
    window.addEventListener('keydown', function(evt){Game.eventHandler('keydown', evt);});

    _curUIMode = Game.UIMode.gameStart;
    this.setRandomSeed((Math.floor(Math.random()*1000000)));
    this._game = this;
    this.renderAll();
  },
  renderAll: function(){
    this.renderMain();
    this.renderMessage();
    this.renderAvatar();
  },

  getDisplay: function(displayName){
      return this.DISPLAYS[displayName].o;
  },
  renderMain: function(){
    if(this._curUIMode !== null && this._curUIMode.hasOwnProperty('renderOnMain')){
        this._curUIMode.renderOnMain(this.DISPLAYS.main.o);
    } else {
    }
  },
  renderMessage: function(){
      Game.Message.renderOn(this.DISPLAYS.message.o);
  },
  renderAvatar: function(){
      for (var i = 0; i < 400; i++){
        this.DISPLAYS.avatar.o.drawText(2, 5, "Woot");
      }
    },
  switchUIMode: function(newMode){
    if (this._curUIMode !== null){
      this._curUIMode.exit();
    }
    this._curUIMode = newMode;
    this._curUIMode.enter();
    this.renderAll();
  },
  getRandomSeed: function(){
    return this._randomSeed;
  },
  setRandomSeed: function(s){
    this._randomSeed = s;
    ROT.RNG.setSeed(this._randomSeed);
  },
  eventHandler: function(eventType, evt){
      if(this._curUIMode !== null && this._curUIMode.hasOwnProperty('handleInput')){
      this._curUIMode.handleInput(eventType, evt);
    }
  },
  toJSON: function() {
    var json = {"_randomSeed":this._randomSeed, "ALL_ENTITIES": Game.ALL_ENTITIES};
    return json;
  }
};
