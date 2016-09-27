// YOUR CODE HERE:
var app = {
  server: "https://api.parse.com/1/classes/messages",
  username: (window.location.search).split("=")[1],
  friendList: [],
  lastUsed: "white",
  roomArray:[],
  room: "",
  init: function() {

  },

  send: function(message) {
    var messageConvert = JSON.stringify(message);
    var context = this;
    $.ajax({
      url: this.server,
      type: "POST",
      data: messageConvert,
      success: function(data) {
        context.fetch(context.room);
        //console.log(data);
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
      urlEncoder = '&limit=40&where={"roomname":"' + parameter + '"}'; 
      filter = true;
    } 
    else {
      urlEncoder = "&limit=300";
    }
    $.ajax({
      url: this.server + "?order=-createdAt" + urlEncoder,
      type: "GET",
      success: function(data) {
        context.clearMessages();
        context.roomArray = [];
        var dataArray = data.results;
        for (var i = 0; i < dataArray.length; i++) {
          context.renderMessage(dataArray[i]);
          if (!context.roomArray.includes(dataArray[i].roomname) && dataArray[i].roomname !== " ") {
            context.roomArray.push(dataArray[i].roomname);
          }
        }
        context.roomArray.sort();
        for (var j = 0; j < context.roomArray.length; j++) {
          context.renderRoom(context.roomArray[j], true);
        }

        context.initializeFriends();
        // $("#chats").css("display", "none");
        // $("#chats").fadeIn("slow");
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
    if(this.lastUsed === "gray") {
      this.lastUsed = "white";
    } else {
      this.lastUsed = "gray";
    }
    $("#chats").append("<div class='singleMessage " + this.lastUsed + "'><div class='username " + this.protectXSS(message.username) + "'>" + this.protectXSS(message.username) + "</div><div class='textMessage'>" + this.protectXSS(message.text) + "</div></div>");
    
  },

  renderRoom: function(roomName, newList) {
    //var room = $("#roomSelect").val();
    if (newList) {
      $("#roomSelect").append("<option>" + roomName + "</option>");
    }
    else {
      if (!this.roomArray.includes(roomName)) {
        $("#roomSelect").append("<option>" + roomName + "</option>");
      }
      else {
        alert("Room Already Exist");
      }
    }
  },

  handleUsernameClick: function(className) {
    $().css("color","red");
  },

  handleSubmit: function() {
    var message = $('.messageInput').val();
    console.log($("#roomSelect").val()); 
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
    this.room = room;
    this.fetch(room);
  },

  initializeFriends: function() {
    var arr = this.friendList;
    for (var i = 0; i < arr.length; i++) {
      $("." + arr[i]).css("color","red");
      $("." + arr[i]).css("font-weight","bold");
    }
    
  }
};



$( document ).ready(function() {
  app.fetch();
  // setInterval(function() {
  //   app.fetch();
  // },4000);

  $( "#roomSelect" ).change(function() {
    app.roomChange();
  });

  $( "#chats" ).delegate('.username', 'click',  function() {
    $("." + $(this).text()).css("color","red");
    $("." + $(this).text()).css("font-weight","bold");
    app.friendList.push($(this).text());
  });

});
