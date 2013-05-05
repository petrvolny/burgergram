(function() {
"use strict";

var CLIENT_ID = '899426d0f7f445ff9f744fff5260e134';

window.App = Ember.Application.create();

App.IndexController = Ember.ArrayController.extend({
    showAbout: false,

    aboutClass: function() {
        return 'about' + (this.get('showAbout') ? ' aboutVisible' : '');
    }.property('showAbout'),

    aboutLabel: function() {
        return this.get('showAbout') ? '#' : '?';
    }.property('showAbout'),

    toggleAbout: function() {
        this.toggleProperty('showAbout');
    },

    loadMore: function() {
        var moreBurgers = App.Burger.find(),
            that = this;

        moreBurgers.addObserver('isLoaded', function() {
            if (moreBurgers.get('isLoaded')) {
                moreBurgers.get('content').forEach(function(burger) {
                    that.get('content').pushObject(burger);
                });
            }
        });
    }
});

App.LoadMoreView = Ember.View.extend({
    templateName: 'loadMore',

    didInsertElement: function() {
        var view = this;
        this.$().bind('inview', function(event, isInView, visiblePartX, visiblePartY) {
            if (isInView) Ember.tryInvoke(view.get('controller'), 'loadMore');
        });
    }
});

App.LoadMoreController = Ember.ObjectController.extend({
    needs: ['index'],

    loadMore: function() {
        this.get('controllers.index').loadMore();
    }
})

App.IndexRoute = Em.Route.extend({
    model: function() {
        return [];
    }
});

App.Burger = Ember.Object.extend({
    lowRes: undefined,
});

App.Burger.reopenClass({
    nextPage: 'https://api.instagram.com/v1/tags/hamburger/media/recent?client_id='+CLIENT_ID,

    find: function() {
        var nextPage = this.nextPage,
            that = this,
            result = Ember.ArrayProxy.create({
                content: [],
                isLoaded: false
            });

        Ember.$.ajax({
            url: this.nextPage,
            dataType: 'jsonp',
            context: this,
            success: function(data) {
                var instaBurgers = data.data,
                    maxIndex = instaBurgers.length - instaBurgers.length%3;

                instaBurgers.forEach(function(burger, index) {
                    if (index >= maxIndex) return;
                    result.pushObject({
                        lowRes: burger.images.low_resolution.url,
                        desc: burger.caption && burger.caption.text,
                        user: burger.user.username,
                        instagramLink: burger.link
                    });
                });
                that.nextPage = data.pagination.next_url;
                result.set('isLoaded', true);
            }
        });

        return result;
    }
});

})();

