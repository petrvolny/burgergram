(function() {
"use strict";

var CLIENT_ID = '899426d0f7f445ff9f744fff5260e134';

window.App = Ember.Application.create();

App.IndexRoute = Em.Route.extend({
    model: function() {
        return App.Burger.find();
    }
});

App.Burger = Ember.Object.extend({
    lowRes: undefined,
});

App.Burger.reopenClass({
    find: function() {
        var result = Ember.ArrayProxy.create({
                content: [],
                isLoaded: false
            });

        Ember.$.ajax({
            url: 'https://api.instagram.com/v1/tags/hamburger/media/recent?client_id='+CLIENT_ID,
            dataType: 'jsonp',
            success: function(data) {
                var instaBurgers = data.data;

                instaBurgers.forEach(function(burger, index) {
                    result.pushObject({
                        lowRes: burger.images.low_resolution.url,
                        desc: burger.caption && burger.caption.text,
                        user: burger.user.username,
                        instagramLink: burger.link
                    });
                });
                result.set('isLoaded', true);
            }
        });

        return result;
    }
});

})();

