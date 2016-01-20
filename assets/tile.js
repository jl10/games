Game.Tile = function (properties) {
  properties = properties || {};
  Game.Symbol.call(this, properties);
  if (! ('attr' in this)) { this.attr = {}; }
  this.attr._name = properties.name || 'unknown';
  this.attr._walkable = properties.walkable||false;
};
Game.Tile.extend(Game.Symbol);

Game.Tile.prototype.getName = function () {
  return this.attr._name;
};
Game.Tile.prototype.isWalkable = function () {
  return this.attr._walkable;
};

Game.Tile.nullTile = new Game.Tile({name:'nullTile',walkable:false});
Game.Tile.floorTile = new Game.Tile({name:'floor',_chr:' ',walkable:true});
Game.Tile.wallTile = new Game.Tile({name:'wall',_chr:'\u2588',walkable:false});
