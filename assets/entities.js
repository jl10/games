Game.EntityTemplates = {};

Game.EntityTemplates.Avatar = {
  _name: 'avatar',
  _chr:'@',
  _fg:'#f00',
  _maxHp: 20,
  _mixins: [Game.EntityMixin.WalkerCorporeal,Game.EntityMixin.HitPoints,Game.EntityMixin.Chronicle]
};

Game.EntityTemplates.Monster = {
  _name: 'Monster',
  _chr:'#',
  _fg:'#060',
  _maxHp: 1,
  _mixins: [Game.EntityMixin.WalkerCorporeal,Game.EntityMixin.HitPoints,Game.EntityMixin.Chronicle]
};
