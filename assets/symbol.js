Game.Symbol = function (template) {
   this.attr = {
       _char: template.chr || '?',
       _fg: template.fg||Game.UIMode.DEFAULT_COLOR_FG,
       _bg: template.bg||Game.UIMode.DEFAULT_COLOR_BG
     };
 };

 Game.Symbol.prototype.getChar = function () {
   return this.attr._char;
 };

 Game.Symbol.prototype.getFg = function () {
   return this.attr._fg;
 };

 Game.Symbol.prototype.getBg = function () {
   return this.attr._bg;
 };

 Game.Symbol.prototype.draw = function (display,disp_x,disp_y) {
   display.draw(disp_x,disp_y,this.attr._char, this.attr._fg, this.attr._bg);
 };

 Game.Symbol.NULL_SYMBOL = new Game.Symbol({});
 Game.Symbol.AVATAR = new Game.Symbol({chr:'@', fg: '#a26', bg:'#fff'});
