Crafty.c('Base', {
    init: function() {
            this.requires('EventManager');
    }
});


// Usage: this.cleanBind('damaged', this._onDamaged, 'PlayerCharacter');
Crafty.c('EventManager', {
    init: function() {

    },

    // This will remove the bind when the component or entity gets removed
    cleanBind: function(eventName, callback, currentComponentName) {
        var binding = this.bind(eventName, callback);

        if(currentComponentName != null)
        {
            binding.one('RemoveComponent', function(componentName) {
                    // Make sure it is the component
                    if(componentName == currentComponentName)
                    {
                            //console.log('removing bind (component)');
                            this.unbind(eventName, callback);
                    }
            });
        }

        binding.one('Remove', function() {
            //console.log('removing bind (entity)');
            this.unbind(eventName, callback);
        });
    }
});

Crafty.c('Actor', {
    init: function() {
        this.requires('Base, 2D, Canvas, 2DExtended');
    }
});

Crafty.c('Shifter', {
    init: function() {
        this.requires('2D');
    },

    shifter: function(dx, dy, dw, dh) {
        this.dx = dx;
        this.dy = dy;
        this.dw = dw;
        this.dh = dh;

        //console.log("shifter");
        this.bind('EnterFrame', this._update);/*.one('RemoveComponent', function() {
			this.unbind('EnterFrame', this._update);
		});*/

        return this;
    },

    _update: function(e) {
        // Convert milliseconds to seconds
        var dt = e.dt * 0.001;
        //console.log(this.dx * dt, this.dy * dt, this.dw * dt, this.dh * dt);
        this.shift(this.dx * dt, this.dy * dt, this.dw * dt, this.dh * dt);

        //this._gradient.x1 *= this.dx * dt;
        //this._gradient.x2 *= this.dx * dt;

        //this._gradient.y1 *= this.dy * dt;
        //this._gradient.y2 *= this.dy * dt;

        var rect = Crafty.viewport.rect();
        if (this.y > rect._h + rect._y) {
            console.log("planet destroyed");
            Crafty.trigger('PlanetDestroyed');
            this.destroy();
        }
    }
});

Crafty.c('Planet', {
    ready: true, // Allows the `Draw` event to be called... idk
    init: function() {
        this.requires('Actor, Shifter, 2D');

        this.cleanBind('Draw', this._draw, 'Planet');/*.one('RemoveComponent', function() {
            this.unbind('Draw', this._draw);
        });*/
    },

    planet: function(radius, gradient) {
        this._radius = radius;

        this._gradient = gradient;

        return this;
    },

    // The x and y of the planet will change
    //  but the x and y centers of the gradient will
    //  never be changed
    //  so the color of the planet will change as it moves
    _draw: function(e) {
        var ctx = e.ctx;

        ctx.save();

        ctx.beginPath();
        ctx.arc(this.x + this._radius, this.y + this._radius, this._radius, 0, 2 * Math.PI, false);

        var grd = ctx.createRadialGradient(
            this._gradient.x1,
            this._gradient.y1,
            this._gradient.r1,

            this._gradient.x2,
            this._gradient.y2,
            this._gradient.r2
        );

        for (var i = 0; i < this._gradient.colorStops.length; i++) {
            grd.addColorStop(i / this._gradient.colorStops.length, this._gradient.colorStops[i]);
        }

        ctx.fillStyle = grd;

        ctx.fill();

        ctx.restore();
    }
});

Crafty.c('Expander', {
    init: function() {
        this.cleanBind('EnterFrame', this._update, 'Expander');/*.one('RemoveComponent', function() {
            this.unbind('EnterFrame', this._update);
        });*/
    },

    expander: function(growProduct, maxHeight, callback) {
        this.growProduct = growProduct;
        this.maxHeight = maxHeight;

        this.callback = callback;

        return this;
    },

    _update: function(e) {
        var dt = e.dt * 0.001;

        var wDiff = this.w * this.growProduct * dt;
        var hDiff = this.h * this.growProduct * dt;

        this.w += wDiff;
        this.h += hDiff;

        this.x -= wDiff / 2;
        this.y -= hDiff / 2;

        if (this.h >= this.maxHeight) {
            console.log("Exceeded");
            var ratio = this.w / this.h;

            this.h = this.maxHeight;
            this.w = this.h * ratio;

            this.unbind('EnterFrame', this._update);

            this.callback();
        }
    }
});

Crafty.c('CanvasShadow', {
    init: function() {

    },

    canvasshadow: function(shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY) {
        this.canvasShadow = true;

        this.shadowColor = shadowColor;
        this.shadowBlur = shadowBlur;
        this.shadowOffsetX = shadowOffsetX;
        this.shadowOffsetY = shadowOffsetY;

        return this;
    }
});

Crafty.c('MoveTo', {
    init: function() {
        this.requires('Actor');

        this._hasCallbackAlreadyRun = false;

        this._hasDebugMarkers = false;

        this.cleanBind('EnterFrame', this._update, 'MoveTo');/*.one('RemoveComponent', function() {
			this.unbind('EnterFrame', this._update);
		});*/
    },

    moveto: function(x, y, timeInSeconds, successCallback) {
        // Destination
        this.destX = x;
        this.destY = y;
        this.timeInSeconds = timeInSeconds;

        this.xDirection = (this.destX > this.x)? 1: -1;
        this.yDirection = (this.destY > this.y)? 1: -1;

        this.totalXDistance = Math.abs(this.destX - this.x) * this.xDirection;
        this.totalYDistance = Math.abs(this.destY - this.y) * this.yDirection;

        this.xPerSec = this.totalXDistance / this.timeInSeconds;
        this.yPerSec = this.totalYDistance / this.timeInSeconds;

        if (successCallback != undefined && successCallback != null) {
            this._successCallback = successCallback;
        }
    },

    _successCallback: function() {
        console.log("arrived");
        console.log("x:", this.x);
        console.log("y:", this.y);
    },

    _update: function(e) {
        if (!this._hasCallbackAlreadyRun) {
            // Total remaining distance to destination
            // var xDistance = Math.abs(this.destX - this.x);
            // var yDistance = Math.abs(this.destY - this.y);

            var xDirection = (this.destX > this.x)? 1: -1;
            var yDirection = (this.destY > this.y)? 1: -1;

            var remainingXDistance = Math.abs(this.destX - this.x) * xDirection;
            var remainingYDistance = Math.abs(this.destY - this.y) * yDirection;

            // // Max distance x or y can change in pixels this update loop
            // var pixChange = e.dt * 0.001 * this.pixPerSec;
            var xChange, yChange;

            var maxXChange = this.xPerSec * e.dt * 0.001;
            var maxYChange = this.yPerSec * e.dt * 0.001;

            // Don't let x and y go past their destination
            if (Math.abs(maxXChange) > Math.abs(remainingXDistance)) {
                xChange = remainingXDistance;
            }
            else {
                xChange = maxXChange;
            }

            if (Math.abs(maxYChange) > Math.abs(remainingYDistance)) {
                yChange = remainingYDistance;
            }
            else {
                yChange = maxYChange;
            }

            this.shift(xChange, yChange, 0, 0);

            if (this._hasDebugMarkers) {
                Crafty.e('DebugMarker')
                    .attr({ x: this.x, y: this.y, w: 5, h: 5 })
                    .color("rgba(255, 11, 45, .4)");
            }

            if (this.isAt(this.destX, this.destY)) {
                if (!this._hasCallbackAlreadyRun) {
                    this._successCallback();

                    this._hasCallbackAlreadyRun = true;
                }
            }
        }
    }
});

// Crafty.c('Bullet', {
//     ready: true, // Allows the `Draw` event to be called... idk
//     init: function() {
//         //console.log("init");
//         this.requires('Actor, Color');
//
//         this.z = 800;
//     }
// });

Crafty.c('ShipDiamond', {
    ready: true, // Allows the `Draw` event to be called... idk
    init: function() {
        //console.log("init");
        this.requires('Actor');

        this.z = 200;

        this.cleanBind('Draw', this._draw, 'ShipDiamond');/*.one('RemoveComponent', function() {
            this.unbind('Draw', this._draw);
        });*/
    },

    _draw: function(e) {
        var ctx = e.ctx;

        ctx.save();
        ctx.translate(e.pos._x, e.pos._y);

        var shipDrawPosition = {
            x: 0,
            y: 0
        };

        ctx.beginPath();

        // Top corner
        //ctx.moveTo(this.x, this.y - this.h / 2);
        ctx.moveTo(shipDrawPosition.x + this.w / 2, shipDrawPosition.y);
        // Right corner
        //ctx.lineTo(this.x + this.w / 2, this.y);
        ctx.lineTo(shipDrawPosition.x + this.w, shipDrawPosition.y + this.h / 2);
        // Bottom corner
        //ctx.lineTo(this.x, this.y + this.h / 2);
        ctx.lineTo(shipDrawPosition.x + this.w / 2, shipDrawPosition.y + this.h);
        // Left corner
        //ctx.lineTo(this.x - this.w / 2, this.y);
        ctx.lineTo(shipDrawPosition.x, shipDrawPosition.y + this.h / 2);
        ctx.closePath();

        if (this.canvasShadow) {
            ctx.shadowColor = this.shadowColor;
            ctx.shadowBlur = this.shadowBlur;
            ctx.shadowOffsetX = this.shadowOffsetX;
            ctx.shadowOffsetY = this.shadowOffsetY;
        }
        ctx.fillStyle = "rgb(119, 119, 119)";
        ctx.fill();

        ctx.restore();
    }
});

Crafty.c('Asteroid', {
    ready: true, // Allows the `Draw` event to be called... idk
    init: function() {
        //console.log("init");
        this.requires('Actor');

        this.z = 800;

        this.initialX = this.x;
        this.initialY = this.y;

        this.color =
            "rgb(" +
            getRandInt(40, 255) + ", " +
            getRandInt(40, 255) + ", " +
            getRandInt(40, 255) +
            ")";

        this.cleanBind('Draw', this._draw, 'Asteroid');
    },

    _draw: function(e) {
        //console.log("dpdraw");
        var ctx = e.ctx;

        ctx.save();
        ctx.translate(e.pos._x, e.pos._y);

        ctx.beginPath();
        ctx.arc(0 + this.w / 2, 0 + this.w / 2, /*radius*/this.w / 2, 0, 2 * Math.PI, false);

        ctx.fillStyle = this.color;

        ctx.fill();

        ctx.restore();
    }
});

// Crafty.c('AsteroidTrail', {
//     ready: true, // Allows the `Draw` event to be called... idk
//     init: function() {
//         //console.log("init");
//         this.requires('Actor');
//
//         this.color = 'rgba(240, 34, 25, 0.7)';
//
//         this.cleanBind('EnterFrame', this._update, 'AsteroidTrail');
//
//         this.cleanBind('Draw', this._draw, 'AsteroidTrail');
//     },
//
//     asteroidtrail: function(asteroid) {
//         this.asteroid = asteroid;
//
//         this.startingX = asteroid._x;
//         this.startingY = asteroid._y;
//     },
//
//     _draw: function(e) {
//         // Draw trail
//         ctx.save();
//
//         ctx.beginPath();
//         //ctx.moveTo(this.initialX, this.initialY);
//         ctx.translate(this.initialX, this.initialY);
//         ctx.moveTo(0, 0);
//
//         //ctx.lineTo(e.pos._x, e.pos._y);
//         ctx.translate(e.pos._x, e.pos._y);
//         ctx.lineTo(0, 0);
//
//         ctx.fillStyle = this.color;
//         ctx.fill();
//
//         ctx.restore();
//     }
// });

Crafty.c('DefensePlanet', {
    ready: true, // Allows the `Draw` event to be called... idk
    init: function() {
        //console.log("dpinit");
        this.requires('Actor');

        this.z = 400;

        this._isTrackingMouse = false;

        Crafty.addEvent(this, Crafty.stage.elem, 'mousemove', function(e) {
            if (this._isTrackingMouse) {
                var rawMousePos =  new utility.Vector2(e.x || e.clientX, e.y || e.clientY);
                var mousePosition = this._screenSpaceToGameSpace(rawMousePos);

                var characterPositionOffset = new utility.Vector2(this.w/2, this.h-(this.h/2));

                var angle = Math.atan2(mousePosition.y - (this.y+characterPositionOffset.y), mousePosition.x - (this.x+characterPositionOffset.x));

                this.origin(characterPositionOffset.x, characterPositionOffset.y);
                this.rotation = utility.toDegrees(angle) + 90;
            }
        });

        this.cleanBind('Draw', this._draw, 'DefensePlanet');/*.one('RemoveComponent', function() {
            this.unbind('Draw', this._draw);
        });*/

        this.bind('RemoveComponent', function(componentName) { console.log(componentName + " was removed") });
    },

    defenseplanet: function(radius, gradient) {
        this.w = 2 * radius;
        this.h = 2 * radius;

        this._gradient = gradient;

        return this;
    },

    _screenSpaceToGameSpace: function(position) {
        // The viewport coordinates are opposite the normal positioning
        return new utility.Vector2(position.x - Crafty.viewport.x, position.y - Crafty.viewport.y);
    },

    // The x and y of the planet will change
    //  but the x and y centers of the gradient will
    //  never be changed
    //  so the color of the planet will change as it moves
    _draw: function(e) {
        //console.log("dpdraw");
        var ctx = e.ctx;

        ctx.save();
        ctx.translate(e.pos._x, e.pos._y);

        ctx.beginPath();
        ctx.arc(0 + this.w / 2, 0 + this.w / 2, /*radius*/this.w / 2, 0, 2 * Math.PI, false);

        var grd = ctx.createRadialGradient(
            this._gradient.x1,
            this._gradient.y1,
            this._gradient.r1,

            this._gradient.x2,
            this._gradient.y2,
            this._gradient.r2
        );

        for (var i = 0; i < this._gradient.colorStops.length; i++) {
            grd.addColorStop(i / (this._gradient.colorStops.length - 1), this._gradient.colorStops[i]);
        }

        ctx.fillStyle = grd;

        ctx.fill();

        ctx.restore();
    }
});

Crafty.c('DebugMarker', {
	// Will be called when the component is added to an entity
	init: function() {
		this.requires('Actor, Color')
			.color('rgb(255, 0, 0)');
	},
	debugMarker: function(color)
	{
		this.color(color);

		return this;
	}
});

Crafty.c('2DExtended', {
    init: function() {
        this.requires('2D');
    },

    getActualPosition: function(deltaPosition) {
            deltaPosition = deltaPosition || new utility.Vector2(0, 0);

            var a = deltaPosition;
            var b = this._origin;
            var c = utility.toRadians(this.rotation);
            // The formulas to rotate a point (A) around a point (B) by angle (C) are as follows:
            var relX = (a.x-b.x) * Math.cos(c) - (a.y-b.y) * Math.sin(c) + b.x;
            var relY = (a.y-b.y) * Math.cos(c) + (a.x-b.x) * Math.sin(c) + b.y;

            var x = this.x + relX;
            var y = this.y + relY;

            return new utility.Vector2(x, y);
    },

    getActualPositionCenter: function(deltaPosition) {
            deltaPosition = deltaPosition || new utility.Vector2(0, 0);

            return this.getActualPosition(new utility.Vector2((this.w/2) + deltaPosition.x, (this.h/2) + deltaPosition.y));
    }
});
