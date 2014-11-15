// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

$.FollowToggle = function (el, options) {
  this.$el = $(el)
  this.$userId = $(el).attr("data-user-id") || options.id;
  
  var initialFolState = ($(el).attr("data-initial-follow-state"));
  if (initialFolState ==="false" ) {
    this.followState = "unfollowed";
  } else if (initialFolState === "true" ) {
    this.followState = "followed";
  } else {
    this.followState = options.followState;
  }
 
  this.render();
  this.$el.on("click", this.handleClick.bind(this));
};

$.FollowToggle.prototype.render = function () {
  if (this.followState === "following") {
    this.$el.prop("disabled", true);
    this.$el.html("Following!");
  } else if (this.followState === "unfollowing") {
    this.$el.prop("disabled", true);
    this.$el.html("Unfollowing!");
  } else if (this.followState === "followed") {
    this.$el.prop("disabled", false);
    this.$el.html("Unfollow!");
  } else if (this.followState === "unfollowed") {
    this.$el.prop("disabled", false);
    this.$el.html("Follow!");
  }
};

$.FollowToggle.prototype.handleClick = function (event) {
  event.preventDefault();
  
  var reqType = "";
  var $el = this;
  if (this.followState === "unfollowed") {
    reqType = "POST";
    this.followState = 'following';
  } else {
    reqType = "DELETE";
    this.followState = 'unfollowing';
  }
  
  this.render();
  
  $.ajax({
    url: "/users/" + $el.$userId + "/follow",
    type: reqType,
    dataType: 'json',
    success: function () {
      $el.followState = ($el.followState === "following" ? "followed" : "unfollowed");
      $el.render();
    }
  });
};

$.fn.followToggle = function (el) {
  return this.each(function () {    
    new $.FollowToggle(this, el);
  });
};

$(function () {
  $("button.follow-toggle").followToggle();
});


$.UsersSearch = function (el) {
  this.$el = $(el);
  this.$input = $('div.users-search input');
  this.$el.on("keyup", 'input', this.handleSearch.bind(this));
};

$.UsersSearch.prototype.handleSearch = function (event) {
  var that = this;
 
  $.ajax({
    url: "/users/search",
    type: 'GET',
    dataType: 'json', 
    data: this.$input,
    success: function(responseJSON, status, responseObject) {
      that.renderResults(responseJSON);
    }
  });
}

$.UsersSearch.prototype.renderResults = function (results) {
  var $ulUsers = $("ul.users");
  $ulUsers.empty();
  results.forEach(function(el) { 
    if (el.followed === true){
      el.followState = 'followed';
    } else {
      el.followState = 'unfollowed';
    }
         
    $ulUsers.append("<li>" + el.username + "<button class=follow-toggle></button></li>"); 
    $("button.follow-toggle").followToggle(el);
  });
}

$.fn.usersSearch = function () {
  return this.each(function () {
    new $.UsersSearch(this);
  });
};

$(function () {
  $("div.users-search").usersSearch();
});