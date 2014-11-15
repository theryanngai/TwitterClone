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

$.FollowToggle = function (el) {
  this.$el = $(el)
  this.$userId = $(el).attr("data-user-id");
  this.followState = ($(el).attr("data-initial-follow-state") === "false" ? "unfollowed" : "followed" );
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

$.fn.followToggle = function () {
  return this.each(function () {
    new $.FollowToggle(this);
  });
};

$(function () {
  $("button.follow-toggle").followToggle();
});


$.UsersSearch = function (el) {
  this.$el = $(el);
  this.$input = $('div.users-search input');
  this.$el.on("keypress", 'input', this.handleSearch.bind(this));
};

// $.UsersSearch.prototype.handleSearch = function (event) {
//   this.$input = $('div.users-search input');
//
//   $.ajax({
//     url: "/users/search",
//     type: 'GET',
//     dataType: 'json',
//     success: function () {}
//   });
// }
//
// $.fn.usersSearch = function () {
//   return this.each(function () {
//     new $.UsersSearch(this);
//   });
// };
//
// $(function () {
//   $("div.users-search").usersSearch();
// });