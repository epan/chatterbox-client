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
        thisObj.getNewMessages($(this).val());
        $('.room-form').hide();
        if ($(this).val() === '- Add new room -') {
          $('.room-form').show();
        }
      });

      $('body').on('click', '.chat-submit', function() {
        var message = {
          username: window.localStorage.username,
          text: $('.chat-input').val(),
          roomname: $('#roomSelect').val()
        }
        thisObj.send(message);
        $('.chat-input').val('');
      })

      $('body').on('click', '.room-submit', function() {
        var message = {
          username: window.localStorage.username,
          text: `This room was created by ${window.localStorage.username} at ${new Date()}!`,
          roomname: $('.room-input').val()
        }
        thisObj.send(message);
        $('.room-input').val('');
        $('.room-form').hide();
        $('.chat-input').focus();
      })

      $('body').on('click', 'form', function(event) {
        event.preventDefault();
      });

    }, thisObj.SEARCH_PARAMS);
  }

  send (message) {
    var thisObj = this;
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {

        thisObj.getNewMessages(message.roomname);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  fetch (successCallback, urlCode = '') {
    $.ajax({
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
    thisObj.clearMessages();
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
    var a = $('<p></p>');
    a.text(`@${message.username}: ${message.text}`)
    $('#chats').append(a);
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
    this.renderRoom('- Add new room -', desiredRoom);
  }
}

var app = new Chatterbox('alex');
app.init();
