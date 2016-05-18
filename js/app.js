// app.js

App = Ember.Application.create();

App.reopen({
  walletAddress: '1GXqRnh753Dtq99JAsfwRwg7XKDPENAZGV',
  apiBaseUrl: 'https://insight.bitpay.com/api/',
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
        controller.set('balanceSat', data.balanceSat);
        controller.set('unconfirmedBalanceSat', data.unconfirmedBalanceSat);

        controller.startBalanceUpdates();
      });

      $.getJSON("https://cors.5apps.com/?uri=https://blockchain.info/stats?format=json", function(data){
        controller.set('marketPriceUSD', data.market_price_usd);
      });
    });
  }

});

App.IndexController = Ember.Controller.extend({

  balanceSat: 0,
  unconfirmedBalanceSat: 0,
  marketPriceUSD: 0,
  targetMBTC: 300,

  balance: function(){
    var balance = this.get('balanceSat') / 100000;
    var unconfirmedBalance = this.get('unconfirmedBalanceSat') / 100000;

    return balance + unconfirmedBalance;
  }.property('balanceSat', 'unconfirmedBalanceSat'),

  balanceFormatted: function(){
    return parseFloat(this.get('balance')).toFixed(2);
  }.property('balance'),

  balanceUSD: function(){
    var fiatValue = this.get('balance') / 1000 * this.get('marketPriceUSD');

    return parseFloat(fiatValue).toFixed(2);
  }.property('balance', 'marketPriceUSD'),

  targetUSD: function(){
    var fiatTarget = this.get('targetMBTC') / 1000 * this.get('marketPriceUSD');

    return parseFloat(fiatTarget).toFixed(2);
  }.property('balance', 'marketPriceUSD'),

  startBalanceUpdates: function(){
    setInterval(function(){
      this.updateBalance();
    }.bind(this), 3000);
  },

  updateBalance: function(){
    Em.$.getJSON(App.get('apiAddressUrl'), function(data){
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
