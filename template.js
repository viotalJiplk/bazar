/*@licstart  The following is the entire license notice for the 
JavaScript code in this page.

Copyright (C) 2022 Vojtech Varecha

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

@licend  The above is the entire license notice
for the JavaScript code in this page.
*/

//custom events :D
const ajaxloaded = new Event('ajaxloaded');
const settingsloaded = new Event('settingsloaded');
const navloaded = new Event('navloaded');

firedevents = [];

class events{
  event = {
    "ajaxloaded": new Event('ajaxloaded'),
    "settingsloaded": new Event('settingsloaded'),
    "navloaded": new Event('navloaded'),
    "fooloaded": new Event('fooloaded')
  };
  constructor(){
    for(let element in this.event){
      window.addEventListener(element, this.fireevent);
    }
  }
  fireevent(event){
    let eventname = event.type;
    if(!firedevents.includes(eventname)){
      firedevents.push(eventname);
    }
  }
  addEventListener(name, listener) {
    if(firedevents.includes(name)){
      listener();
    }else{
      window.addEventListener(name, listener);
    }
  }
}

eventmanager = new events();

//include all required scripts
include(["js/jwthelper.js", "js/ajax.js", "js/init.js"]);
add_css(["include/template.css"]);

/**
 * function to create script element
 * @param {string} url url of js file
 * @returns {HTMLLinkElement}
 */
function add_js(url){
  const script = document.createElement("script");
  script.setAttribute("src", url);
  return script;
}

/**
 *  function to add scripts to all pages
 * @param {Array} scripts array of scripts to include
 */
function include(scripts){
  scripts.forEach(element => {
    document.head.appendChild(add_js(element));
  });
}

/**
 *  function to add css to all pages
 * @param {Array} css array of css to include
 */
function add_css(css){
  css.forEach(element => {
    document.head.appendChild(create_csstag(element));
  });
}

/**
 *  function to set the right nav entry
 * @param {HTMLNavElement} nav nav, where entry is
 */
function set_active(nav){
  let path = window.location.pathname;
  let page = path.split("/").pop();
  if(page == ""){
    page = "index.html";
  }else if(page == "account.html"){
    page = "login.html";
  }
  let active = nav.querySelector('[href="' + page + '"]');
  if(active != null){
    active.setAttribute("class", "active");
  }
}

/**
 * function that cretes navigation bar
 */
function build_nav(){
  ajax("include/nav.html", "GET", function(res){
      const nav = document.createElement("nav");
      nav.innerHTML = res;  //this should be save while it is managed by server - independently on user input
      set_active(nav);
      document.body.insertBefore(nav, document.body.firstElementChild);
      window.dispatchEvent(eventmanager.event.navloaded);
    },
    "");
}

/**
 * function that cretes footer
 */
function build_foo(){
  ajax("include/footer.html", "GET", function(res){
      const foo = document.createElement("footer");
      foo.innerHTML = res;
      document.body.appendChild(foo);
      window.dispatchEvent(eventmanager.event.fooloaded);
    },
    "");
}

window.onload = on_load;

/**
 * this will be executed on load
 */
function on_load(){
  build_nav();
  build_foo();
}

/**
 * function, that creates link tag to link css to page
 * @param {string} url 
 * @returns {HTMLLinkElement}
 */
function create_csstag(url){
  const link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("href", url);
  return link;
}

// lets install service worker
// if('serviceWorker' in navigator) {
//   navigator.serviceWorker
//        .register('sw.js')
//        .then(function() { console.log('Service Worker Registered'); });
// }