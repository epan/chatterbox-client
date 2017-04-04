class Chatterbox {
  constructor(value) {
    this.name = value;
    this.server = 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages';
  }

  init () {
    var thisObj = this;
    this.fetch(function(data) {
      thisObj.renderRooms(data);
      thisObj.renderMessages(data, 'lobby');
    }, '?order=-createdAt&limit=1000');
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

  renderMessages (response, room) {
    var thisObj = this;

    var filteredMessages = response.results.filter(function(message) {
      if (message.roomname === room) {
        return true;
      } else {
        return false;
      }
    });

    filteredMessages.forEach(function(message) {
      thisObj.renderMessage(message);
    });
  }

  clearMessages () {
    $('#chats').children().remove();
  }

  renderMessage (message) {
    $('#chats').append(`<p>[${message.roomname}] @${message.username}: ${message.text}</p>`);
  }

  renderRoom (room) {
    $('#roomSelect').append(`<option value="${room}">${room}</option>`);
    if (room === 'lobby') {
      $('#roomSelect').val('lobby');
    }
  }

  renderRooms (response) {
    var thisObj = this;

    var responseRooms = _.uniq(response.results.map(function(message) {
      return message.roomname;
    }));

    console.log(responseRooms);

    responseRooms.forEach(function(room) {
      thisObj.renderRoom(room);
    });
  }
}

var app = new Chatterbox('alex');
app.init();
