const STYLE_SKIN_LOCAL_STORAGE_ID = 'SKIN_NAME';
const STYLE_SKIN_DEFAULT = 'default';

// http://stackoverflow.com/a/26227662/1527470
const singleton = Symbol();
const singletonEnforcer = Symbol();

class FlexySkinState {
  constructor(enforcer) {
    if (enforcer != singletonEnforcer) {
      throw 'Cannot construct singleton';
    }
    this.switch(this.getCurrent());
  }

  static getInstance() {
    if (!this[singleton]) {
      this[singleton] = new FlexySkinState(singletonEnforcer);
    }
    return this[singleton];
  }

  findLink(skin) {
    const links = document.querySelectorAll('link[data-skin]');
    let skinLink;
    for (let i = 0; i < links.length; i++) {
      let link = links[i];
      if (link.dataset && link.dataset.skin) {
        if (link.dataset.skin === skin) {
          skinLink = link;
        }
      }
    }
    return skinLink;
  }

  isLoaded(skinLink) {
    if (skinLink) {
      const styleSheet = [].slice.call(document.styleSheets).find(item => {
        return item.href && item.href.indexOf(skinLink.getAttribute('href')) !== -1;
      });
      return !!styleSheet;
    }
    return false;
  }

  disableSkins(skin) {
    const links = document.querySelectorAll('link[data-skin]');
    links.forEach(link => {
      if (link.dataset && link.dataset.skin) {
        if (link.dataset.skin !== skin) {
          link.disabled = true;
        }
      }
    });
  }

  switch(skin) {
    const skinLink = this.findLink(skin);
    if (skinLink) {
      if (!this.isLoaded(skinLink)) {
        skinLink.onload = () => {
          this.disableSkins(skin);
        };
      } else {
        this.disableSkins(skin);
      }
      skinLink.disabled = false;
      this.setSkin(skin);
    } else {
      console.warn(`Skin [${skin}] is not supported`);
    }
  }

  getCurrent() {
    const skin = localStorage.getItem(STYLE_SKIN_LOCAL_STORAGE_ID);
    return skin ? skin : STYLE_SKIN_DEFAULT;
  }

  setSkin(skin) {
    localStorage.setItem(STYLE_SKIN_LOCAL_STORAGE_ID, skin);
    console.log('Init skin ' + skin);
  }
}

// Init skin state
window['skinState'] = FlexySkinState.getInstance();
