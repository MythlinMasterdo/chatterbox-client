// YOUR CODE HERE:
var app = {
  server: "https://api.parse.com/1/classes/messages",
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

  fetch: function(parameter) {
    var context = this;
    var filter = false;
    if (parameter) {
      urlEncoder = "&limit=1000"; 
      filter = true;
    } 
    else {
      urlEncoder = "&limit=40";
    }
    $.ajax({
      url: this.server + "?order=-createdAt" + urlEncoder,
      type: "GET",
      success: function(data) {
        console.log(data);
        var dataArray = data.results;
        for (var i = 0; i < dataArray.length; i++) {
          if(filter) {
            if (dataArray[i].roomname === parameter) {
              context.renderMessage(dataArray[i]);
            }
          }
          else {
            context.renderMessage(dataArray[i]);
          }
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
    $("#chats").append("<div>" + this.protectXSS(message.username) + " " + this.protectXSS(message.text) + "</div>");
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
      roomname: $("#roomSelect").val()
    };

    this.send(data);
  },

  protectXSS: function(text) {
    var __entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': '&quot;',
      "'": '&#39;',
      "/": '&#x2F;'
    };
    return String(text).replace(/[&<>"'\/]/g, function (s) {  
      return __entityMap[s];
    });
  },

  roomChange: function() {
    this.clearMessages();
    var room = $( "#roomSelect" ).val();
    this.fetch(room);
  }
};



$( document ).ready(function() {
  app.fetch();

  $( "#roomSelect" ).change(function() {
    app.roomChange();
  });
});
