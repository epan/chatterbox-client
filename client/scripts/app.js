class Chatterbox {
  constructor(value) {
    this.name = value;
    this.server = 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages';
    this.SEARCH_PARAMS = '?order=-createdAt&limit=1000';
  }

  init () {
    var thisObj = this;
    this.fetch(function(data) {
      thisObj.renderRooms(data, 'lobby');
      thisObj.renderMessages(data, 'lobby');
      $('#roomSelect').change(function() {
        thisObj.clearMessages();
        // $(this).val()
        console.log($(this).val());
        thisObj.getNewMessages($(this).val());
      });
    }, thisObj.SEARCH_PARAMS);
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

  getNewMessages (room) {
    var thisObj = this;
    this.fetch(function(data) {
      console.log(data);
      thisObj.renderRooms(data, room);
      thisObj.renderMessages(data, room);
    }, thisObj.SEARCH_PARAMS);
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

  renderRoom (room, desiredRoom) {
    $('#roomSelect').append(`<option value="${room}">${room}</option>`);
    if (room === desiredRoom) {
      $('#roomSelect').val(desiredRoom);
    }
  }

  renderRooms (response, desiredRoom) {
    $('#roomSelect').children().remove();
    var thisObj = this;

    var responseRooms = _.uniq(response.results.map(function(message) {
      return message.roomname;
    }));

    console.log(responseRooms);

    responseRooms.forEach(function(room) {
      thisObj.renderRoom(room, desiredRoom);
    });
  }
}

var app = new Chatterbox('alex');
app.init();
