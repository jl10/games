console.log("hello console");

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
  init: function(){
    console.log("test");
    for (var displayName in this.DISPLAYS){
      if (this.DISPLAYS.hasOwnProperty(displayName)){
        this.DISPLAYS[displayName].o = new ROT.Display({width:this.DISPLAYS[displayName].w, height:this.DISPLAYS[displayName].h});
      }
    }
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
    for (var i = 0; i < 400; i++){
      this.DISPLAYS.main.o.drawText(2, 5+i, "Woot");
    }
  },
  renderMessage: function(){
    for (var i = 0; i < 400; i++){
      this.DISPLAYS.message.o.drawText(2, 5+i, "Woot");
    }
  },
  renderAvatar: function(){
      for (var i = 0; i < 400; i++){
        this.DISPLAYS.avatar.o.drawText(2, 5+i, "Woot");
      }
    }
};
