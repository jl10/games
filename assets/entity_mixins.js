Game.EntityMixin = {};

// Mixins have a META property is is info about/for the mixin itself and then all other properties. The META property is NOT copied into objects for which this mixin is used - all other properies ARE copied in.

Game.EntityMixin.WalkerCorporeal = {
  META: {
    mixinName: 'WalkerCorporeal',
    mixinGroup: 'Walker'
  },
  tryWalk: function (map,dx,dy) {
    var targetX = Math.min(Math.max(0,this.getX() + dx),map.getWidth());
    var targetY = Math.min(Math.max(0,this.getY() + dy),map.getHeight());

    if (map.getTile(targetX,targetY).isWalkable()) {

      if (this.hasMixin('Chronicle')) { // NOTE: this is sub-optimal because it couple this mixin to the Chronicle one (i.e. this needs to know the Chronicle function to call) - the event system will solve this issue
        this.trackTurn();
      }
      for (var entID in Game.Data.ALL_ENTITIES){
        if (targetX == Game.Data.ALL_ENTITIES[entID].getX() && targetY == Game.Data.ALL_ENTITIES[entID].getY()){
            if (Game.Data.ALL_ENTITIES[entID].getName() != this.getName()){
              console.log("COMBAAAT");
              this.combat(entID);
            }
            return false; //entity in the way
        }
      }
      return true; //walkable tile, no entities in the way
    }
    return false; //not walkable tile
  },
  combat: function(entID){
    console.log("ENT:  " + Game.Data.ALL_ENTITIES[entID].getName());
    var avatarAttack = 1;
    Game.Message.pushMessage("You hit the moss.");
    Game.Data.ALL_ENTITIES[entID].takeHits(avatarAttack);

    var d = new Date();
    Game.UIMode.gamePlay.attr._timeLastKill = d.getTime();
  }
};

Game.EntityMixin.Chronicle = {
  META: {
    mixinName: 'Chronicle',
    mixinGroup: 'Chronicle',
    stateNamespace: '_Chronicle_attr',
    stateModel:  {
      turnCounter: 0
    }
  },
  trackTurn: function () {
    this.attr._Chronicle_attr.turnCounter++;
  },
  getTurns: function () {
    return this.attr._Chronicle_attr.turnCounter;
  },
  setTurns: function (n) {
    this.attr._Chronicle_attr.turnCounter = n;
  }
};

Game.EntityMixin.HitPoints = {
  META: {
    mixinName: 'HitPoints',
    mixinGroup: 'HitPoints',
    stateNamespace: '_HitPoints_attr',
    stateModel:  {
      maxHp: 1,
      curHp: 1
    },
    init: function (template) {
      this.attr._HitPoints_attr.maxHp = template._maxHp || 1;
      this.attr._HitPoints_attr.curHp = template._curHp || this.attr._HitPoints_attr.maxHp;
      this.attr._HitPoints_attr.aware = false;
    }
  },
  getMaxHp: function () {
    return this.attr._HitPoints_attr.maxHp;
  },
  setMaxHp: function (n) {
    this.attr._HitPoints_attr.maxHp = n;
  },
  getCurHp: function () {
    return this.attr._HitPoints_attr.curHp;
  },
  setCurHp: function (n) {
    this.attr._HitPoints_attr.curHp = n;
  },
  takeHits: function (amt) {
    this.attr._HitPoints_attr.curHp -= amt;
    if(this.getCurHp() <= 0){
      Game.Message.messageGenie("mossDeath");
      delete Game.Data.ALL_ENTITIES[this._entityID];
    }
  },
  isAware: function(){
    return this.attr._HitPoints_attr.aware;
  },
  makeAware: function(a){
    this.attr._HitPoints_attr.aware = a;
  },
  recoverHits: function (amt) {
    this.attr._HitPoints_attr.curHp = Math.min(this.attr._HitPoints_attr.curHp+amt,this.attr._HitPoints_attr.maxHp);
  }
};
