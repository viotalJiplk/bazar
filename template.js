/*@licstart  The following is the entire license notice for the 
JavaScript code in this page.

Copyright (C) 2021 Vojtech Varecha

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

@licend  The above is the entire license notice
for the JavaScript code in this page.
*/

const ajaxloaded = new Event('ajaxloaded');
const navloaded = new Event('navloaded');

//include all required scripts
include(["js/ajax.js", "js/init.js"]);
add_css(["include/nav.css", "include/content.css", "include/footer.css"]);

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
 * 
 * @param {Array} scripts array of scripts to include
 */
function include(scripts){
  scripts.forEach(element => {
    document.head.appendChild(add_js(element));
  });
}

function add_css(css){
  css.forEach(element => {
    document.head.appendChild(create_csstag(element));
  });
}

function set_active(nav){
  let path = window.location.pathname;
  let page = path.split("/").pop();
  if(page == ""){
    page = "index.html";
  }
  let active = nav.querySelector('[href="' + page + '"]');
  if(active != null){
    active.setAttribute("class", "active");
  }
}

function build_nav(){
  ajax("include/nav.html", "GET", function(res){
      const nav = document.createElement("nav");
      nav.innerHTML = res;
      set_active(nav);
      document.body.insertBefore(nav, document.body.firstElementChild);
      window.dispatchEvent(navloaded);
    },
    "");
}
function build_foo(){
  ajax("include/footer.html", "GET", function(res){
      const foo = document.createElement("footer");
      foo.innerHTML = res;
      document.body.appendChild(foo);
    },
    "");
}

window.onload = on_load;

function on_load(){
  build_nav();
  build_foo();
}

function create_csstag(url){
  const link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("href", url);
  return link;
}