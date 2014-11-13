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
        // Canvas will always be 'fullscreen'/size of browser viewport
        Crafty.init(null, null, this.stage());

        Crafty.scene('Loading');
    }
};
