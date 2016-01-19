Game.Message={
  _messages: [" "," "," "," "," "," "],
  renderOn: function(display) {
    display.clear();
    for (var y = 0; y < 6; y++){
      display.drawText(1, y, this._messages[y]);
    }
  },
  pushMessage: function(mes){
    this._messages.shift();
    this._messages.push(mes);
    Game.renderMessage();
  },
  clearMessage: function() {
    this._messages = [" "," "," "," "," "," "];
    Game.renderMessage();
  }
};
