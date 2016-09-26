// YOUR CODE HERE:
var app = {
  server: "https://api.parse.com/1/classes/messages?order=-createdAt&limit=40",
  username: (window.location.search).split("=")[1],
  init: function() {

  },

  send: function(message) {
    var messageConvert = JSON.stringify(message);

    $.ajax({
      url: this.server,
      type: "POST",
      data: messageConvert,
      success: function(data) {
        console.log(data);
      },
      error: function(error) {
        console.error(error);
      }
    });
  },

  fetch: function() {
    var context = this;
    $.ajax({
      url: this.server,
      type: "GET",
      success: function(data) {
        console.log(data);
        var dataArray = data.results;
        for (var i = 0; i < dataArray.length; i++) {
          context.renderMessage(dataArray[i]);
        }
      },
      error: function(error) {
        console.error(error);
      }
    });
  },

  clearMessages: function() {
    $("#chats").empty();
  },

  renderMessage: function(message) {
    $("#chats").append("<div>" + message.username + " " + protection(message.text) + "</div>");
  },

  renderRoom: function(roomName) {
    //var room = $("#roomSelect").val();
    $("#roomSelect").append("<option>" + roomName + "</option>");
  },

  handleUsernameClick: function() {

  },

  handleSubmit: function() {
    var message = $('.messageInput').val();
    
    var data = {
      username: this.username,
      text: message,
      roomname: 'lobby'
    };

    this.send(data);
  }

};

var __entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};

var protection = function(text) {
    return String(text).replace(/[&<>"'\/]/g, function (s) {  
        return __entityMap[s];
    });
}




$( document ).ready(function() {
    app.fetch();
});
