var background;
var gameLayer ={};
var scrollSpeed = 1;
var ship;
var gameGravity = -0.05;
var gameThrust = 0.1;

var gameScene = cc.Scene.extend({
 onEnter:function () {
     this._super();
     gameLayer = new game();
     gameLayer.init();
     this.addChild(gameLayer);
     }
});
var game = cc.Layer.extend({
 init:function () {
    this._super();
     cc.eventManager.addListener({
         event: cc.EventListener.MOUSE,
         onMouseDown: function(event){
             ship.engineOn = true;
         },
         onMouseUp: function(event){
             ship.engineOn = false;
         }
     },this)
    background = new ScrollingBG();
    this.addChild(background);
    this.scheduleUpdate();
    this.schedule(this.addAsteroid,0.5);
    ship = new Ship();
    this.addChild(ship);

 },
 update:function(dt){
    background.scroll();
    ship.updateY();
 },
 addAsteroid:function(event){
     var asteroid = new Asteroid();
     this.addChild(asteroid,1);
 },
     removeAsteroid:function(asteroid){
     this.removeChild(asteroid);
 }
});

var ScrollingBG = cc.Sprite.extend({
 ctor:function() {
     this._super();
     this.initWithFile("src/assets/background.png");
 },
 onEnter:function() {
    this.setPosition(0,160);
 },
 scroll:function(){
     this.setPosition(this.getPosition().x-scrollSpeed,this.getPosition().y);
     if(this.getPosition().x<0){
        this.setPosition(this.getPosition().x+480,this.getPosition().y);
     }
 }
});

var Ship = cc.Sprite.extend({
 ctor:function() {
     this._super();
     this.initWithFile("src/assets/ship.png");
     this.ySpeed = 0;
     this.engineOn = false;
 },
 onEnter:function() {
    this.setPosition(60,160);
 },
 updateY:function() {
     if(this.engineOn){
        this.ySpeed += gameThrust;
     }
     this.setPosition(this.getPosition().x,this.getPosition().y+this.ySpeed);
     this.ySpeed += gameGravity;
 }
});

var Asteroid = cc.Sprite.extend({
 ctor:function() {
 this._super();
 this.initWithFile("src/assets/asteroid.png");
 },
 onEnter:function() {
 this._super();
 this.setPosition(600,Math.random()*320);
 var moveAction= cc.MoveTo.create(2.5, new cc.Point(-100,Math.random()*320));
 this.runAction(moveAction);
 this.scheduleUpdate();
 },
 update:function(dt){
 if(this.getPosition().x<-50){
 gameLayer.removeAsteroid(this)
 }
 }
});