Game.Symbol = function (chr, fg = Game.UIMode.DEFAULT_COLOR_FG, bg = Game.UIMode.DEFAULT_COLOR_BG) {
   this.attr = {
       _char: chr,
       _fg:fg,
       _bg:bg
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
