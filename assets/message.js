Game.Message={
  _messages: [" "," "," "," "," "," "],
  _library: {
    "wait": [
      "You're pooped, and decide to wait a turn.",
      "You take a moment to call your mother.  A turn passes.",
      "You ponder the nature of the human condition.  A turn passes.",
      "You are overcome with lethargy.  A turn passes.",
      "SQUIRREL! Oh, it was just moss, nevermind.  A turn passes.",
      "You suddenly remember that thing that was really funny, and chuckly.  A turn passes.",

    ],
    "sleep": [
      "You fell asleep, since you took so long.  It takes you a turn to wake from your slumber.",
      "Oh, you're back.  One second, gotta boot up the internet again...a turn passes.",
      "While you were gone: mankind has settled on Edmund's planet.  And a turn has passed.",
      "While you were gone: Obama was elected president.  MALIA Obama.  A turn has passed, too.",
      "While you were gone: everyone you love has passed away, you are forgotten from this world.  A turn has passed, too.",
      "I trusted you.  I trusted you, and you left me.  I waited an entire turn for you, you...you...scoundrel!",
      "Slowpoke.  A turn passes.",
      "You lazy bum.  A turn passes.",
      "Almost impressively slow...a turn passes.",
      "Tick, tock, tick...a turn passes.",

    ],
    "mossDeath": [
      "The moss dies.",
      "The moss died, wow, didn't think you had it in you.",
      "The moss perishes.  He had a family.",
      "The moss begs for mercy, but you slay it anyway.  You heartless, soulless scoundrel.",
      "The little green pound sign on your screen disappears.  I suppose that means you killed the moss it was representing.",
      "That moss was particularly satisfying to kill.  You rejoice.",
      "THE MOSS HAS BEEN SLAIN!  HUZZAH!  HUZZAH!  HUZZAH!",
      "The moss woulda had ya that time, if it wasn't for ya meddling kids...",
      "A moment of silence for the mosses that have given their lives to serve this game.                                                            ",
    ],
    "lose":[
      "You've exhausted all of your musical energy battling the viscious moss.  You're dead now...in spirit.",
      "The moss was too great for you...even though it is a plant and you are not.  You have died.",
      "You died.  That means the game is over.  Go home.  Or try again, I guess, but you obviously aren't very good at this!",
      "Dear Player:  We regret to inform you that this episode of Moss Fighter 2016 has been terminated due to the failure of the player to successfully complete the game on time, or because of the incompetence of the player in the face of hostile moss.  We apologize for the inconvenience, and invite you to try Moss Fighter 2016 again at your leisure.  Sincerely, Management.",

    ],
    "win":[
      "You win the game.  I hope this has made you happy!",
      "Congradulations, you've finally cleaned the moss out of the dungeon-studio.  You proceed to produce some mad mixtapes.",
      "The moss perishes, and the President of the United States awards you with a medal congradulating your achievements in this historic battle against the hostile moss lifeform.  You rejoice.",
      
    ]

  },
  renderOn: function(display) {
    display.clear();
    for (var y = 0; y < 6; y++){
      display.drawText(1, y, this._messages[y]);
    }
  },
  pushMessage: function(mes){
    console.log(mes);
    if (mes.length>97){
      var i = 96;
      while (mes[i] != ' ' && i > 0){
        i--;
      }
      if (i > 0){
        this._messages.shift();
        this._messages.push(mes.substring(0, i));
        Game.renderMessage();

        this.pushMessage("\t"+mes.substring(i, mes.length));
      } else {
        this._messages.shift();
        this._messages.push(mes.substring(0, 97));
        Game.renderMessage();

        this.pushMessage("\t"+mes.substring(97, mes.length));
      }
    } else {
      this._messages.shift();
      this._messages.push(mes);
      Game.renderMessage();
    }

  },
  clearMessage: function() {
    this._messages = [" "," "," "," "," "," "];
    Game.renderMessage();
  },
  randMessage: function(cat){
    return  this._library[cat][Math.floor(ROT.RNG.getUniform() * this._library[cat].length)];
  },
  messageGenie: function(cat){
    this.pushMessage(this.randMessage(cat));
  }

};
