Game = {
    stage: function() {
        /*document.getElementsByClassName('game-stage')[0]*/
        return $('.game-stage')[0];
    },

    width: function() {
        //return $(Crafty.stage).parent().width();
        return $(this.stage()).parent().width();
    },

    height: function() {
        //return $(Crafty.stage).parent().height();
        return $(this.stage()).parent().height();
    },

    start: function() {
        Crafty.init(this.width(), this.height(), this.stage());
        //Crafty.background('rgb(0, 0, 0)');

        window.onresize = function() {
            console.log("resize");
            Crafty.init(null, null, Game.stage());
        };

        // Load Intro scene to get things going
        Crafty.scene('Loading');
    }
};
