import {updateParams} from './params';
import environment from './environment';
import extractLocation from '../shared/extractLocation';
import network from './network';

let redirectTimer = null;

class Router {

  _changed = false

  async _redirect(target) {
    const {url} = extractLocation(target);
    if(url != this.url) {
      clearTimeout(redirectTimer);
      redirectTimer = setTimeout(async () => {
        if(environment.static) {
          network.processing = true;
          const endpoint = url == '/' ? '/index.json' : `${url}/index.json`;
          const response = await fetch(endpoint);
          window.instances = await response.json();
          network.processing = false;
        }
        updateParams(url);
        history.pushState({}, document.title, url);
        window.dispatchEvent(new Event('popstate'));
        this._changed = true;
      }, 0);
    }
  }

  get url() {
    return extractLocation(window.location.pathname+window.location.search).url;
  }

  set url(target) {
    this._redirect(target);
  }

  get path() {
    return extractLocation(window.location.pathname).path;
  }

  set path(target) {
    this._redirect(target+window.location.search);
  }

}

const router = new Router();

export default router;