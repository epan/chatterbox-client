class Chatterbox {
  constructor(value) {
    this.name = value;
    this.server = 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages';
  }

  init () {

  }

  send (message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  fetch (successCallback, urlCode = '') {
    return $.ajax({
      url: this.server + urlCode,
      type: 'GET',
      contentType: 'application/json',
      success: function(data) {
        successCallback(data);
      },
      error: function () {
        console.log('it broke');
      }
    });
  }

  renderAllMessages (urlParams) {
    var thisObj = this;
    this.fetch(function(data) {
      data.results.forEach(function(message) {
        thisObj.renderMessage(message);
      });
    }, urlParams);
  }

  clearMessages () {
    $('#chats').children().remove();
  }

  renderMessage (message) {
    $('#chats').append(`<p>[${message.roomname}] @${message.username}: ${message.text}</p>`);
  }

  renderRoom (room) {
    var thisObj = this;
    $('#roomSelect').append(`<option value="${room}">${room}</option>`);
    // this.renderAllMessages(`?where={"roomname":"${room}"}`);
  }
}

var app = new Chatterbox('alex');
