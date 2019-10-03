var STYLE_SKIN_LOCAL_STORAGE_ID = 'SKIN_NAME';
var STYLE_SKIN_DEFAULT = 'default';

var skinState = new (function() {

  this.findLink = function(skin) {
    var links = document.querySelectorAll('link[data-skin]');
    var skinLink;
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      if (link.dataset && link.dataset.skin) {
        if (link.dataset.skin === skin) {
          skinLink = link;
        }
      }
    }
    return skinLink;
  };

  this.isLoaded = function(skinLink) {
    if (skinLink) {
      var styleSheet = [].slice.call(document.styleSheets).find(function (item) {
        return item.href && item.href.indexOf(skinLink.getAttribute('href')) !== -1;
      });
      return !!styleSheet;
    }
    return false;
  }

  this.disableSkins = function(skin) {
    var links = document.querySelectorAll('link[data-skin]');
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      if (link.dataset && link.dataset.skin) {
        if (link.dataset.skin !== skin) {
          link.disabled = true;
        }
      }
    }
  };

  this.switch = function(skin) {
    var skinLink = this.findLink(skin);
    if (!this.isLoaded(skinLink)) {
      skinLink.onload = function () {
        this.disableSkins(skin);
      }.bind(this);
    } else {
      this.disableSkins(skin);
    }
    skinLink.disabled = false
    this.setDefault(skin);
  };

  this.getDefault = function() {
    var skin = localStorage.getItem(STYLE_SKIN_LOCAL_STORAGE_ID);
    return skin ? skin : STYLE_SKIN_DEFAULT;
  };

  this.setDefault = function(skin) {
    localStorage.setItem(STYLE_SKIN_LOCAL_STORAGE_ID, skin);
  };

  this.switch(this.getDefault());
  console.log('Skin', this.getDefault());
})();
