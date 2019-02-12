// this is phonegap specific document.addEventListener("deviceready", setup, false);


//function setup(){ /   navigator.notification.alert(     'You are the winner!',  message     alertDismissed,  callback     'Game Over',  title     'Done'  buttonName   );}

showAlert: function (message, title){
  if (navigator.notification){
    navigator.notification.alert(message, null, title, 'ok');
  } else {
    alert(title ? (title + ": " + message) : message);
  }
},

initialize: function(){
  var self = this;
  this.store = new MemoryStore(function(){
    self.showAlert('Store initialized', 'Info');
  });
  $('.search-key').on('keyup', $.proxy(this.findByName, this));
}
