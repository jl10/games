Game.ALL_ENTITIES = {};

Game.EntityTemplates = {};

Game.EntityTemplates.Avatar = {
  name: 'avatar',
  chr:'@',
  fg:'#ddd',
  maxHp: 10,
  mixins: [Game.EntityMixin.WalkerCorporeal,Game.EntityMixin.HitPoints,Game.EntityMixin.Chronicle]
};

Game.EntityTemplates.Monster = {
  name: 'Monster',
  chr:'#',
  fg:'#060',
  maxHp: 1,
  mixins: [Game.EntityMixin.WalkerCorporeal,Game.EntityMixin.HitPoints,Game.EntityMixin.Chronicle]
};
