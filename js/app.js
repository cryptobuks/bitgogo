// app.js

App = Ember.Application.create();

App.reopen({
  walletAddress: '1GXqRnh753Dtq99JAsfwRwg7XKDPENAZGV',
  apiBaseUrl: 'http://insight.kip.pe/api/',
  apiAddressUrl: function(){
    return this.get('apiBaseUrl') + 'addr/' + this.get('walletAddress');
  }.property('walletAddress', 'apiBaseUrl')
});

App.Router.map(function() {
  // put your routes here
});

App.IndexRoute = Ember.Route.extend({

  setupController: function(controller) {
    this._super();

    Em.run(function(){
      Em.$.getJSON(App.get('apiAddressUrl'), function(data){
        console.log(data);
        controller.set('balanceSat', data.balanceSat);
      });
    });
  }

});

App.IndexController = Ember.Controller.extend({

  balanceSat: 0,

  balance: function(){
    var sat = this.get('balanceSat');
    return sat / 100000;
  }.property('balanceSat')

});
