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
        controller.set('unconfirmedBalanceSat', data.unconfirmedBalanceSat);

        controller.startBalanceUpdates();
      });
    });
  }

});

App.IndexController = Ember.Controller.extend({

  balanceSat: 0,

  balance: function(){
    var balance = this.get('balanceSat') / 100000;
    var unconfirmedBalance = this.get('unconfirmedBalanceSat') / 100000;

    return balance + unconfirmedBalance;
  }.property('balanceSat', 'unconfirmedBalanceSat'),

  startBalanceUpdates: function(){
    setInterval(function(){
      this.updateBalance();
    }.bind(this), 3000);
  },

  updateBalance: function(){
    Em.$.getJSON(App.get('apiAddressUrl'), function(data){
      console.log(data);
      var balance = this.get('balance');
      var newBalance = (data.balanceSat + data.unconfirmedBalanceSat) / 100000;

      if (balance !== 0 && (balance !== newBalance)) {
        console.log(balance, newBalance);
        this.playSound();
      }

      this.set('balanceSat', data.balanceSat);
      this.set('unconfirmedBalanceSat', data.unconfirmedBalanceSat);
    }.bind(this));
  },

  playSound: function(){
    Em.$('audio')[0].play();
  },

});
