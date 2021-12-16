//=============================================================================
// PONG
//=============================================================================

Pong = {

  Defaults: {
    width:     640,   // logical canvas width (browser will scale to physical canvas size - which is controlled by @media css queries)
    height:    480,   // logical canvas height (ditto)
    wallWidth: 1,
    balls:     3,
    stats:     true
  },

  //-----------------------------------------------------------------------------

  initialize: function(runner, cfg) {
    this.cfg    = cfg;
    this.runner = runner;
    this.width  = runner.width;
    this.height = runner.height;
    this.court  = Object.construct(Pong.Court,  this);
    this.balls  = this.constructBalls();
    this.runner.start();
  },

  constructBalls: function() {
    var balls = [];
    for(var n = 0 ; n < this.cfg.balls ; n++)
      balls.push(Object.construct(Pong.Ball, this));
    return balls;
  },

  update: function(dt) {
    //Colision detection
    
    for(var n = 0 ; n < this.balls.length ; n++) {
      for(var m = 0 ; m < this.balls.length ; m++) {
        var dist = Game.getdist(this.balls[n].x,this.balls[n].y,this.balls[m].x,this.balls[m].y);
        if (dist < 10 && n != m) {
          this.balls[n].dead = true;
        }
      }
    }
    
    //newballsplease
    var newballs = [];
    for(var n = 0 ; n < this.balls.length ; n++){
      if (this.balls[n].dead == false) {
        newballs.push(this.balls[n])
      }
    }
    this.balls = newballs;

    var n =  Game.getdist(1,2,3,4);
    //movement update
    for(var n = 0 ; n < this.balls.length ; n++)
      this.balls[n].update(dt);
  },

  draw: function(ctx) {
    this.court.draw(ctx);
    for(var n = 0 ; n < this.balls.length; n++)
      this.balls[n].draw(ctx);
  },

  addball: function() {
    this.balls.push(Object.construct(Pong.Ball, this));
  },


  // Key press commands

  onkeydown: function(keyCode) {
    switch(keyCode) {
      case Game.KEY.Q: this.addball();    break;
    }
  },

  onkeyup: function(keyCode) {
    switch(keyCode) {
      case Game.KEY.Q: this.addball();    break;
    }
  },

  //=============================================================================
  // COURT
  //=============================================================================

  Court: {

    initialize: function(pong) {
      var w  = pong.width;
      var h  = pong.height;
      var ww = pong.cfg.wallWidth;

      this.walls = [];
      this.walls.push({x: 0,    y: 0,      width: w,  height: ww});
      this.walls.push({x: 0,    y: h - ww, width: w,  height: ww});
      this.walls.push({x: 0,    y: 0,      width: ww, height:  h});
      this.walls.push({x: w-ww, y: 0,      width: ww, height:  h});
    },

    draw: function(ctx) {
      ctx.fillStyle = '#F08010';
      for(var n = 0 ; n < this.walls.length ; n++)
        ctx.fillRect(this.walls[n].x, this.walls[n].y, this.walls[n].width, this.walls[n].height);
    }

  },

  //=============================================================================
  // BALL
  //=============================================================================

  Ball: {

    initialize: function(pong) {
      this.pong    = pong;
      this.radius  = 5;
      this.minX    = pong.cfg.wallWidth + this.radius;
      this.minY    = pong.cfg.wallWidth + this.radius;
      this.maxX    = pong.width  - pong.cfg.wallWidth - this.radius;
      this.maxY    = pong.height - pong.cfg.wallWidth - this.radius;
      this.x       = Game.random(this.minX, this.maxX);
      this.y       = Game.random(this.minY, this.maxY);
      this.direction = Game.random(0,6.28318531);
      this.velocity = 100;
      this.dx      = (this.velocity * Game.getSinCos("sin", this.direction));
      this.dy      = (this.velocity * Game.getSinCos("cos", this.direction));
      this.color   = "rgb(" + Math.round(Game.random(0,255)) + ", " + Math.round(Game.random(0,255)) + ", " + Math.round(Game.random(0,255)) + ")";
      this.dead    = false;
    },

    update: function(dt) {

      this.direction = this.direction + Game.random(-0.2,0.2);

      this.velocity = this.velocity + Game.random(-0.2,0.2);

      this.dx      = (this.velocity * Game.getSinCos("sin", this.direction));
      this.dy      = (this.velocity * Game.getSinCos("cos", this.direction));

      this.x = this.x + (this.dx * dt);
      this.y = this.y + (this.dy * dt);

      if ((this.dx > 0) && (this.x > this.maxX)) {
        this.x = this.minX;
        //this.dx = -this.dx;
      }
      else if ((this.dx < 0) && (this.x < this.minX)) {
        this.x = this.maxX;
        //this.dead = true;
        //this.dx = -this.dx;
      }

      if ((this.dy > 0) && (this.y > this.maxY)) {
        this.y = this.minY;
        //this.dy = -this.dy;
      }
      else if ((this.dy < 0) && (this.y < this.minY)) {
        this.y = this.maxY;
        //this.dy = -this.dy;
      }
    },

    draw: function(ctx) {
      var w = h = this.radius * 2;
      
      //var angle=Game.getAngleDeg(0,0,this.dx,this.dy);


      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
      ctx.fill();
      ctx.closePath();

      ctx.beginPath();              
      ctx.lineWidth = "1";
      ctx.strokeStyle = this.color;  // Green path
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - Game.getSinCos("sin", this.direction)*20, this.y - Game.getSinCos("cos", this.direction)*20);
      ctx.stroke();  // Draw it

    },
/*
    getx: function() {
      return this.x;
    },

    gety: function() {
      return this.y;
    }
*/
  }

}; // Pong
