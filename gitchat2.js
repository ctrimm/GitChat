Messages = new Meteor.Collection("Messages");

if (Meteor.isClient) {
  Template.messages.messages = function() {
    return Messages.find({
    }, {
      sort: {
        timestamp: 1
      },
      limit: 200
    });
  };

  Template.message_me = function() {
    var userProfileName = Meteor.user().profile.name;
    console.log(userProfileName);
    return userProfileName;
  }


  Template.input.events({
    'click #send': function() {
      var message = $('#newMessage').val();
      if(Meteor.user() == null)
        var username = '';
      else
        var username = Meteor.user().profile.name;
      if (!message || !username) {
        alert('Login using Github, yo!');
      }
      Meteor.saveMessage({
        message: message,
        username: username,
        timestamp: Date.now()
      });
    }
  });

  Template.input.events({
      //CODE FOR HITTING ENTER/RETURN BUTTON ON KEYBOARD TO SEND MESSAGES
      "keydown #newMessage": function(event){
      if(event.which == 13){
        // Submit the form
        var username = Meteor.user().profile.name;
        var message = $('#newMessage').val();
        if(name.value != '' && message.value != ''){
          Messages.insert({
            message: message,
            username: username,
            timestamp: Date.now()
          });
            newMessage.value = '';
        }
      }
    }
  });

    Template.message.events({
    'click #remove': function() {
      Messages.remove(this._id);
    }
  });

  Meteor.autorun(function() {
    Meteor.subscribe("Messages");
  });

  Meteor.saveMessage = function(content) {
    var username = Meteor.user().profile.name;
    var message = content.message;
    if (!username || !message) {
      return;
    }
    Messages.insert({
      username: username,
      message: message,
      timestamp: Date.now()
    }, function(err, id) {
      if (err) {
        alert('Something defnitely went wrong!');
      }
      if (id) {
        $('#newMessage').val('');
        $('#username').val('');
      }
    });
  };

  //CODE FOR MAKING SCROLLBAR STICK TO BOTTOM
  var textarea = document.getElementById('messages_container');
  textarea.scrollTop = textarea.scrollHeight;

}

if (Meteor.isServer) {
  Meteor.startup(function() {
    // code to run on server at startup

  });

  Meteor.publish("Messages", function() {
    return Messages.find();
  });

  Messages.allow({
    'insert': function(userId, doc) {
      return true;
    },
    'remove': function(userId, doc) {
      return true;
    }
  });
}