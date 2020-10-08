Crafty.scene('Loading', function() {
    console.log("Loading scene");

    document.getElementsByClassName('main-menu-ui')[0].style.visibility = 'hidden';
    document.getElementsByClassName('in-game-ui')[0].style.visibility = 'hidden';
    document.getElementsByClassName('game-over-ui')[0].style.visibility = 'hidden';

    document.getElementsByClassName('loading-ui')[0].style.visibility = 'visible';

    Crafty.load([
        'audio/8bit_bomb_explosion.mp3',
        'audio/8bit_bomb_explosion.ogg',
        'audio/8bit_bomb_explosion.aac',

        'audio/Afterburner.mp3',
        'audio/Afterburner.ogg',
        'audio/Afterburner.aac',

        'audio/Dream_2_Ambience.mp3',
        'audio/Dream_2_Ambience.ogg',
        'audio/Dream_2_Ambience.aac',

        'audio/FX181.mp3',
        'audio/FX181.ogg',
        'audio/FX181.aac',

        'audio/FX194.mp3',
        'audio/FX194.ogg',
        'audio/FX194.aac',

        'audio/FX202.mp3',
        'audio/FX202.ogg',
        'audio/FX202.aac',

        'audio/Orbital_Colossus.mp3',
        'audio/Orbital_Colossus.ogg',
        'audio/Orbital_Colossus.aac',

        'audio/ventilator.mp3',
        'audio/ventilator.ogg',
        'audio/ventilator.aac'
    ], function() {
        console.log("Loaded");

        Crafty.audio.add('bomb_explosion', [
                'audio/8bit_bomb_explosion.mp3',
                'audio/8bit_bomb_explosion.ogg',
                'audio/8bit_bomb_explosion.aac'
            ]
        );

        Crafty.audio.add('Afterburner', [
                'audio/Afterburner.mp3',
                'audio/Afterburner.ogg',
                'audio/Afterburner.aac'
            ]
        );

        Crafty.audio.add('Dream_2_A', [
                'audio/Dream_2_Ambience.mp3',
                'audio/Dream_2_Ambience.ogg',
                'audio/Dream_2_Ambience.aac'
            ]
        );

        Crafty.audio.add('Harsh', [
                'audio/FX181.mp3',
                'audio/FX181.ogg',
                'audio/FX181.aac'
            ]
        );

        Crafty.audio.add('Thud', [
                'audio/FX194.mp3',
                'audio/FX194.ogg',
                'audio/FX194.aac'
            ]
        );

        Crafty.audio.add('Flourish', [
                'audio/FX202.mp3',
                'audio/FX202.ogg',
                'audio/FX202.aac'
            ]
        );


        Crafty.audio.add('Orbital_Colossus', [
                'audio/Orbital_Colossus.mp3',
                'audio/Orbital_Colossus.ogg',
                'audio/Orbital_Colossus.aac'
            ]
        );

        Crafty.audio.add('Twang', [
                'audio/ventilator.mp3',
                'audio/ventilator.ogg',
                'audio/ventilator.aac'
            ]
        );

        console.log("Audio added")

        Crafty.scene('Intro');
    });
});

Crafty.scene('Intro', function() {
    console.log("Intro scene");

    Crafty.audio.stop();

    document.getElementsByClassName('loading-ui')[0].style.visibility = 'hidden';
    document.getElementsByClassName('main-menu-ui')[0].style.visibility = 'hidden';
    document.getElementsByClassName('in-game-ui')[0].style.visibility = 'hidden';
    document.getElementsByClassName('game-over-ui')[0].style.visibility = 'hidden';
    document.getElementsByClassName('directions')[0].style.visibility = 'hidden';

    document.getElementsByClassName('intro-ui')[0].style.visibility = 'visible';

    Crafty.audio.play('Dream_2_A', -1);

    var shipDiamond = Crafty.e('ShipDiamond')
        .attr({ x: 0, y: 0, w: 30, h: 70 });

    shipDiamond.addComponent('CanvasShadow')
        .canvasshadow('#000000', 50, 0, 0);

    function centerOnShip() {
        Crafty.viewport.centerOn(shipDiamond, 1);
    }

    Crafty.viewport.clampToEntities = false;
    centerOnShip();

    window.addEventListener('resize', centerOnShip);

    var planets = [];

    function addPlanet() {
        // var yIn = getRandInt(-Game.height() / 4, -1);
        //
        // planets.push(getRandPlanet(undefined, yIn, undefined, Game.height() / 2, 0, 0));

        var minDimension = Math.min(Game.width(), Game.height());

        var radius = getRandInt(0.05 * minDimension, 0.26 * minDimension);

        var x = getRandInt(-(Game.width() / 2), Game.width() / 2);
        var y = -(Game.height() / 2) - (radius * 2);

        var gradX = (Math.random() < 0.5)? getRandInt(-(1.1 * radius), -radius) : getRandInt(radius, 1.1 * radius);
        var gradY = getRandInt(-(Game.height() / 8), Game.height() / 8);

        gradX += x;

        var gradRadius2 = getRandInt(2 * radius, 6 * radius);

        var colorStops = [];
        for (var i = 0; i < 3; i++) {
            colorStops.push(getRandColor());
        }

        var gradient = Gradient(
            gradX,
            gradY,
            0,
            gradX,
            gradY,
            gradRadius2,
            colorStops
        );

        /* */
        planets.push(
            Crafty.e('Planet')
                .attr({ x: x, y: y, w: (2 * radius), h: (2 * radius) })
                .planet(radius, gradient)
                .shifter(0, getRandInt(25, 35))
        );
        /* */
    }

    // Inital population of planets
    for (var i = 0; i < 8; i++) {
        //planets.push(getRandPlanet(undefined, undefined, undefined, undefined, 0, 0));

        addPlanet();

        planets[i].y += getRandInt(0, Game.height());
    }

    Crafty.bind('PlanetDestroyed', addPlanet);

    function transition() {
        /* */
        console.log("transition");

        window.removeEventListener('click', transition);

        document.getElementsByClassName('intro-ui')[0].style.visibility = 'hidden';

        Crafty.unbind('PlanetDestroyed', addPlanet);

        for (var i = 0; i < planets.length; i++) {
            planets[i].dy *= 10;
        }

        shipDiamond.addComponent('Expander')
            .expander(1.2, Game.height() * 1.75, nextScene);

        Crafty.audio.stop();
        Crafty.audio.play('Flourish');
        /* */
    }

    function nextScene() {
        window.removeEventListener('resize', centerOnShip);

        Crafty.audio.stop();

        Crafty.scene("MainMenu");
    }

    window.addEventListener('click', transition);
});

Crafty.scene('MainMenu', function() {
    console.log("MainMenu scene");

    document.getElementsByClassName('loading-ui')[0].style.visibility = 'hidden';
    document.getElementsByClassName('in-game-ui')[0].style.visibility = 'hidden';
    document.getElementsByClassName('game-over-ui')[0].style.visibility = 'hidden';
    document.getElementsByClassName('directions')[0].style.visibility = 'hidden';

    // ok green 145, 255, 58
    // good yellow rgb(245, 255, 72)
    document.getElementsByClassName('game-wrapper')[0].style.backgroundImage = 'linear-gradient(to right, black, ' + getRandColor() + ', black)';

    document.getElementsByClassName('main-menu-ui')[0].style.visibility = 'visible';

    Crafty.audio.play('Afterburner', -1);

    var shipWidth = Game.height() * 1.75 * (3/7);
    var shipHeight = Game.height() * 1.75;

    var shipDiamond = Crafty.e('ShipDiamond')
        .attr({ x: -(shipWidth / 2), y: -(shipHeight / 2), w: shipWidth, h: shipHeight });

    shipDiamond.addComponent('CanvasShadow')
        .canvasshadow('#000000', 50, 0, 0);

    Crafty.viewport.centerOn(shipDiamond, 1);

    function outro(e) {
        console.log("outro");

        document.getElementsByClassName('play-button')[0].removeEventListener('click', outro);

        // Hide ui
        document.getElementsByClassName('main-menu-ui')[0].style.visibility = 'hidden';

        // Back to black background
        document.getElementsByClassName('game-wrapper')[0].style.backgroundImage = '';
        document.getElementsByClassName('game-wrapper')[0].style.backgroundColor = '#000000';

        Crafty.audio.stop();
        console.log("play Harsh sound");
        Crafty.audio.play('Harsh', 1);

        shipDiamond.addComponent('MoveTo')
            .moveto(shipDiamond.x, 1500, 4, function() {
                console.log("shipDiamond moved to success");

                //shipDiamond.removeComponent('MoveTo', false);

                Crafty.scene('Playing');
            });
    }

    document.getElementsByClassName('play-button')[0].addEventListener('click', outro);
});

Crafty.scene('Playing', function() {
    console.log("Playing scene");

    Crafty.audio.stop();

    document.getElementsByClassName('loading-ui')[0].style.visibility = 'hidden';
    document.getElementsByClassName('main-menu-ui')[0].style.visibility = 'hidden';
    document.getElementsByClassName('in-game-ui')[0].style.visibility = 'hidden';
    document.getElementsByClassName('game-over-ui')[0].style.visibility = 'hidden';

    document.getElementsByClassName('directions')[0].style.visibility = 'visible';

    // Restart .directions animation. http://css-tricks.com/restart-css-animation/
    var elm = document.getElementsByClassName('directions')[0];
    var newone = elm.cloneNode(true);
    elm.parentNode.replaceChild(newone, elm);

    var planetRadius = Math.min(Game.width(), Game.height()) * 0.1;

    // Initial location of gradient of planet
    var gradX = planetRadius / 2;
    var gradY = planetRadius / 2;

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
        .attr({ x: planetRadius - (shipWidth / 2), y: -(Crafty.viewport.height / 2), w: shipWidth, h: shipHeight });

    Crafty.viewport.clampToEntities = false;
    Crafty.viewport.centerOn(defensePlanet, 1);

    var score = 0;
    $('.score')[0].innerHTML = score;

    shipDiamond.addComponent('MoveTo')
        .moveto(shipDiamond.x/* ship is moving straight down */, shipDiamond.h * 0.6, 3, function() {
            console.log("different arrived");

            Crafty.audio.play('Thud');

            document.getElementsByClassName('in-game-ui')[0].style.visibility = 'visible';

            // Play game music after delay after landing on planet
            setTimeout(function() {
                Crafty.audio.play('Orbital_Colossus', -1);
            }, 700);

            defensePlanet.attach(shipDiamond);

            defensePlanet.origin(defensePlanet.w / 2, defensePlanet.h / 2);

            // Planet looks at mouse after ship lands
            defensePlanet._isTrackingMouse = true;

            var allAsteroids = [];

            var newAsteroids = setInterval(function() {
                //console.log("new a");

                var highVal = 500;
                var lowVal = 300;

                var astX = (Math.random() < 0.5)? getRandInt(-highVal, -lowVal) : getRandInt(lowVal, highVal);
                var astY = (Math.random() < 0.5)? getRandInt(-highVal, -lowVal) : getRandInt(lowVal, highVal);

                var asteroid = Crafty.e('Asteroid')
                    .attr({
                        x: astX,
                        y: astY,
                        w: planetRadius * 0.5,
                        h: planetRadius * 0.5
                    });

                var timeToHit = 5;
                var decreaseTime = (score / 50) * 0.5;//Asteroids get faster as score increases

                timeToHit -= decreaseTime;

                if (timeToHit < 1.85) {
                    timeToHit = 1.85;
                }

                asteroid.addComponent("MoveTo")
                    .moveto(planetRadius, planetRadius, timeToHit, function() {
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

                        // $('.game-over-text')[0].style.visibility = 'visible';
                        // $('.play-again')[0].style.visibility = 'visible';
                        document.getElementsByClassName('game-over-ui')[0].style.visibility = 'visible';
                    });

                //asteroid._hasDebugMarkers = true;

                allAsteroids.push(asteroid);

            }, 700);

            $('.play-again')[0].addEventListener('click', restart);
            $('.back-to-menu')[0].addEventListener('click', backToMenu);

            function restart() {
                $('.in-game-ui')[0].style.visibility = 'hidden';
                $('.score')[0].innerHTML = "0";
                $('.game-over-ui')[0].style.visibility = 'hidden';

                $('.play-again')[0].removeEventListener('click', restart);

                Crafty.scene('Playing');
            }

            function backToMenu() {
                $('.back-to-menu')[0].removeEventListener('click', backToMenu);

                Crafty.scene('MainMenu');
            }

            window.addEventListener('mousedown', shoot);

            function shoot(e) {
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
                    if (allAsteroids[i].isAt(mousePosition.x, mousePosition.y)) {
                        //console.log("killAst");

                        score += 1;

                        $('.score')[0].innerHTML = score;

                        allAsteroids[i].destroy();

                        allAsteroids.splice(i,1);
                    }
                }
            }
        });
});
