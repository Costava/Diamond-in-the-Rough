Crafty.scene('Loading', function() {
    console.log("Loading scene");

    document.getElementsByClassName('loading-ui')[0].style.visibility = 'visible';

    Crafty.load([
        'audio/8bit_bomb_explosion.aac',
        'audio/8bit_bomb_explosion.mp3',
        'audio/8bit_bomb_explosion.ogg',

        'audio/Afterburner.aac',
        'audio/Afterburner.mp3',
        'audio/Afterburner.ogg',

        'audio/Dream_2_Ambience.aac',
        'audio/Dream_2_Ambience.mp3',
        'audio/Dream_2_Ambience.ogg',

        'audio/FX181.aac',
        'audio/FX181.mp3',
        'audio/FX181.ogg',

        'audio/FX194.aac',
        'audio/FX194.mp3',
        'audio/FX194.ogg',

        'audio/FX202.aac',
        'audio/FX202.mp3',
        'audio/FX202.ogg',

        'audio/Orbital_Colossus.aac',
        'audio/Orbital_Colossus.mp3',
        'audio/Orbital_Colossus.ogg',

        'audio/ventilator.aac',
        'audio/ventilator.mp3',
        'audio/ventilator.ogg'
    ], function() {
        console.log("Loaded");

        Crafty.audio.add('bomb_explosion', [
                'audio/8bit_bomb_explosion.aac',
                'audio/8bit_bomb_explosion.mp3',
                'audio/8bit_bomb_explosion.ogg'
            ]
        );

        Crafty.audio.add('Afterburner', [
                'audio/Afterburner.aac',
                'audio/Afterburner.mp3',
                'audio/Afterburner.ogg'
            ]
        );

        Crafty.audio.add('Dream_2_A', [
                'audio/Dream_2_Ambience.aac',
                'audio/Dream_2_Ambience.mp3',
                'audio/Dream_2_Ambience.ogg'
            ]
        );

        Crafty.audio.add('FX181', [
                'audio/FX181.aac',
                'audio/FX181.mp3',
                'audio/FX181.ogg'
            ]
        );

        Crafty.audio.add('Thud', [
                'audio/FX194.aac',
                'audio/FX194.mp3',
                'audio/FX194.ogg'
            ]
        );

        Crafty.audio.add('FX202', [
                'audio/FX202.aac',
                'audio/FX202.mp3',
                'audio/FX202.ogg'
            ]
        );


        Crafty.audio.add('Orbital_Colossus', [
                'audio/Orbital_Colossus.aac',
                'audio/Orbital_Colossus.mp3',
                'audio/Orbital_Colossus.ogg'
            ]
        );

        Crafty.audio.add('Twang', [
                'audio/ventilator.aac',
                'audio/ventilator.mp3',
                'audio/ventilator.ogg'
            ]
        );

        console.log("Audio added")

        Crafty.scene('Intro');
    });
}, function() {// Do this when leaving Intro scene
    document.getElementsByClassName('loading-ui')[0].style.visibility = 'hidden';
});

Crafty.scene('Intro', function() {
    console.log("Intro scene");

    Crafty.audio.play('Dream_2_A', -1);

    var planets = [];

    function addPlanet() {
        var yIn = getRandInt(-Game.height() / 4, -1);

        planets.push(getRandPlanet(undefined, yIn, undefined, Game.height() / 2, 0, 0));
    }

    for (var i = 0; i < 8; i++) {
        planets.push(getRandPlanet(undefined, undefined, undefined, undefined, 0, 0));
    }

    Crafty.bind('PlanetDestroyed', addPlanet);

    var shipDiamond = Crafty.e('ShipDiamond')
        .attr({ x: 0, y: 0, w: 30, h: 70 });

    shipDiamond.addComponent('CanvasShadow')
        .canvasshadow('#000000', 50, 0, 0);

    Crafty.viewport.clampToEntities = false;
    Crafty.e('LerpCamera').lerpCamera(shipDiamond, 5);

	//Crafty.viewport.follow(shipDiamond, 0, 0);

    function transitioning() {
        /* */
        console.log("click");

        window.removeEventListener('click', transitioning);

        Crafty.unbind('PlanetDestroyed', addPlanet);

        for (var i = 0; i < planets.length; i++) {
            planets[i].dy *= 10;
        }

        shipDiamond.addComponent('Expander')
            .expander(1.2);

        Crafty.audio.stop();
        Crafty.audio.play('FX202');

        // Crafty.bind('DoneExpanding', function() {
        //     Crafty.scene('MainMenu');
        // });

        // setTimeout(function() {
        //     //Crafty.audio.play('Afterburner', -1);
        //     Crafty.scene('MainMenu');
        // }, (Game.height() / 438) * 2000);
        // // Timeout delay is adjusted by height of canvas because
        // //  expanding takes longer with higher canvas


        //Crafty.scene('MainMenu');

        /* */
    }

    //Crafty.scene('Playing');

    function nextScene() {
        window.removeEventListener('click', nextScene);

        Crafty.audio.stop();

        Crafty.scene("MainMenu");
    }

    window.addEventListener('click', nextScene);
});

Crafty.scene('MainMenu', function() {
    console.log("MainMenu scene");
    Crafty.audio.play('Afterburner', -1);

    var shipWidth = Game.height() * 1.75 * (3/7);
    var shipHeight = Game.height() * 1.75;

    var shipDiamond = Crafty.e('ShipDiamond')
        .attr({ x: -(shipWidth / 2), y: -(shipHeight / 2), w: Game.height() * 1.75 * (3/7), h: Game.height() * 1.75 });

    shipDiamond.addComponent('CanvasShadow')
        .canvasshadow('#000000', 50, 0, 0);

    // ok green 145, 255, 58
    // good yellow rgb(245, 255, 72)
    //$('.game-wrapper')[0].className += ' ' + 'menu-gradient';
    $('.game-wrapper')[0].style.backgroundImage = 'linear-gradient(to right, black, ' + getRandColor() + ', black)';

    $('.game-ui')[0].style.visibility = 'visible';

    $('.play-button')[0].addEventListener('click', outro);

    function outro(e) {
        console.log("outro");
        $('.play-button')[0].removeEventListener('click', outro);

        // Hide ui
        $('.game-ui')[0].style.visibility = 'hidden';

        // Back to black background
        $('.game-wrapper')[0].style.backgroundImage = '';
        $('.game-wrapper')[0].style.backgroundColor = '#000000';

        Crafty.audio.stop();
        Crafty.audio.play('FX181');

        shipDiamond.addComponent('MoveTo')
            .moveto(-(shipDiamond.w / 2), 1500, 4, function() {
                console.log("shipDiamond moved to success");

                //shipDiamond.removeComponent('MoveTo', false);

                Crafty.scene('InBetween');
            });

        // setTimeout(function() {
        //     Crafty.scene('Playing');
        // }, 2000);
    }
});

Crafty.scene('InBetween', function() {
    console.log("InBetween scene");

    Crafty.scene('Playing');
});

Crafty.scene('Playing', function() {
    console.log("Playing scene");

    var planetRadius = Math.min(Game.width(), Game.height()) * 0.1;

    // Initial location of gradient of planet
    var gradX = planetRadius / 2;
    var gradY = planetRadius / 2;
    //var gradX = getRandInt(-planetRadius, planetRadius);
    //var gradY = Math.sqrt(Math.pow(planetRadius, 2) - Math.pow(gradX, 2));

    var colorStops = [];
    for (var i = 0; i < 3; i++) {
        colorStops.push(getRandColor());
    }

    var grd = Gradient(gradX, gradY, 0, gradX, gradY, 2 * planetRadius, colorStops);

    var defensePlanet = Crafty.e('DefensePlanet')
        .attr({ x: 0, y: 0, w: 2 * planetRadius, h: 2 * planetRadius })
        .defenseplanet(planetRadius, grd);

    var shipWidth = planetRadius * 0.4;
    var shipHeight = shipWidth * (7/3);

    var shipDiamond = Crafty.e('ShipDiamond')
        .attr({ x: planetRadius - shipWidth / 2, y: -(Crafty.viewport.height / 2), w: shipWidth, h: shipHeight });

    var moveCameraTo = function(position) {
        Crafty.viewport.scroll('_x', position.x);
        Crafty.viewport.scroll('_y', position.y);
        Crafty.viewport._clamp();
    };

    var centerCameraTo = function(position) {
        var newCameraPosition = {
            x: -(position.x + (position.w / 2) - (Crafty.viewport.width / 2)),
            y: -(position.y + (position.h / 2) - (Crafty.viewport.height / 2))
        };

        moveCameraTo(newCameraPosition);
    };

    console.log("CrVpX", Crafty.viewport.x);
    console.log("CvVpY", Crafty.viewport.y);

    Crafty.viewport.clampToEntities = false;
    centerCameraTo(defensePlanet);

    console.log("CrVpX", Crafty.viewport.x);
    console.log("CvVpY", Crafty.viewport.y);

    var score = 0;

    shipDiamond.addComponent('MoveTo')
        .moveto(planetRadius - (shipDiamond.w / 2), shipDiamond.h * 0.6, 3, function() {
            console.log("different arrived");

            Crafty.audio.play('Thud');

            $('.score')[0].style.visibility = 'visible';

            setTimeout(function() {
                Crafty.audio.play('Orbital_Colossus', -1);
            }, 700);

            defensePlanet.attach(shipDiamond);

            defensePlanet.origin(defensePlanet.w / 2, defensePlanet.h / 2);
            //defensePlanet.rotation = 90;

            // Crafty.e('DebugMarker')
            //     .attr({ x: defensePlanet.x, y: defensePlanet.y, w: 10, h: 10 })
            //     .color('rgb(0, 255, 0)');

            // Planet looks at mouse after ship lands
            defensePlanet._isTrackingMouse = true;

            var allAsteroids = [];

            var newAsteroids = setInterval(function() {
                //console.log("new a");

                var highVal = 500;
                var lowVal = 300;

                var astX = (Math.random() < 0.5)? getRandInt(-highVal, -lowVal) : getRandInt(lowVal, highVal);
                var astY = (Math.random() < 0.5)? getRandInt(-highVal, -lowVal) : getRandInt(lowVal, highVal);

                //console.log(astX, astY);

                var asteroid = Crafty.e('Asteroid')
                    .attr({
                        x: astX,
                        y: astY,
                        w: 25,
                        h: 25
                    })
                    .color("#555");

                asteroid.addComponent("MoveTo")
                    .moveto(planetRadius, planetRadius, 4.4, function() {
                        console.log("die");

                        //console.log("removeEvent this:", this);
                        //Crafty.removeEvent(this, Crafty.stage.elem, 'mousedown', shoot);
                        window.removeEventListener('mousedown', shoot);

                        defensePlanet._isTrackingMouse = false;

                        Crafty.audio.stop();
                        Crafty.audio.play('Twang');

                        clearInterval(newAsteroids);

                        //asteroid.destroy();
                        for (var i = 0; i < allAsteroids.length; i++) {
                            allAsteroids[i].destroy();
                        }

                        $('.game-over-text')[0].style.visibility = 'visible';
                        $('.play-again')[0].style.visibility = 'visible';
                    });

                asteroid._hasDebugMarkers = true;

                allAsteroids.push(asteroid);

            }, 700);

            $('.play-again')[0].addEventListener('click', restart);

            function restart() {
                $('.score')[0].style.visibility = 'hidden';
                $('.score')[0].innerHTML = "0";
                $('.game-over-text')[0].style.visibility = 'hidden';
                $('.play-again')[0].style.visibility = 'hidden';

                $('.play-again')[0].removeEventListener('click', restart);

                Crafty.scene('Playing');
            }

            //console.log("addEvent this:", this);
            //Crafty.addEvent(this, Crafty.stage.elem, 'mousedown', shoot);
            window.addEventListener('mousedown', shoot);

            function shoot(e) {
                // Crafty.e('DebugMarker')
                //     .attr({
                //         x: shipDiamond.getActualPosition({ x: shipDiamond.w / 2, y: 0 }).x,
                //         y: shipDiamond.getActualPosition({ x: shipDiamond.w / 2, y: 0 }).y,
                //         w: 6,
                //         h: 6
                //     })
                //     .color('rgb(0, 0, 255)');

                Crafty.audio.play('bomb_explosion');

                var screenSpaceToGameSpace = function(position) {
                    // The viewport coordinates are opposite the normal positioning
                    return new utility.Vector2(position.x - Crafty.viewport.x, position.y - Crafty.viewport.y);
                };

                //var shipCenter = shipDiamond.getActualPosition({ x: shipDiamond.w / 2, y: shipDiamond.h / 2 });
                var shipTip = shipDiamond.getActualPosition({ x: shipDiamond.w / 2, y: 0 });
                var rawMousePos =  new utility.Vector2(e.x || e.clientX, e.y || e.clientY);
                var mousePosition = screenSpaceToGameSpace(rawMousePos);

                for (var i = 0; i < allAsteroids.length; i++) {
                    /*console.log("ax:", allAsteroids[i].x);
                    console.log("ay:", allAsteroids[i].y);

                    console.log("mx:", mousePosition.x);
                    console.log("my:", mousePosition.y);

                    var distance = Math.sqrt(Math.pow(mousePosition.x - allAsteroids[i].x, 2) + Math.pow(mousePosition.y - allAsteroids[i].y, 2));

                    console.log(distance);

                    if (distance < 12) {
                        console.log("kill ast");

                        allAsteroids[i].destroy();
                    }*/

                    if (allAsteroids[i].isAt(mousePosition.x, mousePosition.y)) {
                        //console.log("killAst");

                        score += 1;

                        $('.score')[0].innerHTML = score;

                        allAsteroids[i].destroy();
                    }
                }

                //console.log(shipCenter);
                //console.log(shipTip);

                // Crafty.e('DebugMarker')
                //     .attr({ x: shipTip.x, y: shipTip.y, w: 5, h: 5 })
                //     .color('#777');
                //
                Crafty.e('DebugMarker')
                    .attr({ x: mousePosition.x, y: mousePosition.y, w: 5, h: 5 })
                    .color('rgba(150, 160, 10, 0.3)');

                // var shootDir = new utility.Vector2(mousePosition.x - shipTip.x, mousePosition.y - shipTip.y);
                //
                // shootDir = shootDir.normalized();
                // //console.log(defensePlanet.rotation);
                //
                // var bullet = Crafty.e('Bullet')
                //     .attr({ x: shipTip.x, y: shipTip.y, w: 10, h: 10 })
                //     .color('rgb(240, 120, 50)');
                //
                // var bulletDistance = 100;
                //
                // bullet.addComponent('MoveTo')
                //     .moveto(shipTip.x + (shootDir.x * bulletDistance), shipTip.y + (shootDir.y * bulletDistance), 30, function() {
                //         console.log("destroy bullet");
                //         bullet.destroy();
                //     });

            }

            //shipDiamond.removeComponent('MoveTo', false);
        });

    function rotate(v1, v2, rads) {
    	// Get this Vector2 relative to v
    	var relativeToV = new Vector2(v1.x - v2.x, v1.y - v2.y);

    	// Calculate the polar coords of the relative Vector2
    	var radius = Math.sqrt(Math.pow(relativeTov2.x, 2) + Math.pow(relativeTov2.y, 2));
    	var angle = Math.atan2(relativeTov2.y, relativeTov2.x);

    	angle += rads;

    	var relRotatedX = radius * Math.cos(angle);
    	var relRotatedY = radius * Math.sin(angle);

    	var newX = v2.x + relRotatedX;
    	var newY = v2.y + relRotatedY;

    	return new Vector2(newX, newY);
    };
});

// Possible to specify the center of the planet (xIn and yIn)
//  and adjust center of the gradient (dGradX and dGradY)
// Planet is randomly generated in aread around the center X and Y
function getRandPlanet(xIn, yIn, dGradX, dGradY, centerX, centerY) {
    var randX = getRandInt(0, Game.width() - 1);
    var randY = getRandInt(0, Game.height() - 1);

    var x = (isNaN(xIn))? randX : xIn;
    //console.log(x);
    var y = (isNaN(yIn))? randY : yIn;

    if (!isNaN(centerX)) {
        x += centerX
        x -= Game.width() / 2;
    }
    if (!isNaN(centerY)) {
        y += centerY
        y -= Game.height() / 2;
    }

    var radius = getRandInt(8, Math.min(Game.width(), Game.height()) / 7);

    // gradX and gradY are on edge of planet
    var gradX = x + getRandInt(-radius, radius);
    gradY += (isNaN(dGradX))? 0 : dGradX;
    var gradY = y + Math.sqrt(Math.pow(radius, 2) - Math.pow(gradX - x, 2));
    gradY += (isNaN(dGradY))? 0 : dGradY;

    var randColors = [];
    for (var j = 0; j < 3; j++) {
        randColors[j] = 'rgb(' +
            getRandInt(0, 255) + ', ' +
            getRandInt(0, 255) + ', ' +
            getRandInt(0, 255) + ')';
    }

    var grd = Gradient(
        gradX,
        gradY,
        0,

        gradX,
        gradY,
        getRandInt(2 * radius, 8 * radius),
        [
            randColors[0],
            randColors[1],
            randColors[2]
        ]
    );

    return Crafty.e('Planet')
        .attr({ x: x, y: y })
        .planet(radius, grd)
        .shifter(0, 30);
}
