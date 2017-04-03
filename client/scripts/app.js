class App {
  constructor() {
    
  }

  init () {

  }

  send (message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  fetch () {
    
  }
}

var app = new App();

var message = {
  username: 'test',
  text: 'this is a test',
  roomname: 'lobby'
};

app.send(message);