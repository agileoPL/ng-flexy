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
    return link;
  };

  this.switch = function(skin) {
    var skinLink = this.findLink(skin);
    if (skinLink) {
      var links = document.querySelectorAll('link[data-skin]');
      for (var i = 0; i < links.length; i++) {
        var link = links[i];
        if (link.dataset && link.dataset.skin) {
          if (link.dataset.skin === skin) {
            link.disabled = false;
          } else {
            link.disabled = true;
          }
        }
      }
      this.setDefault(skin);
      return true;
    }
    return false;
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
