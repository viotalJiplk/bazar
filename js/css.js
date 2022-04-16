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

//just for testing inputs
function testin( varin, type){
    if (!(typeof varin === type)){
        throw "wrong input";
    }
}

/**
 * function to turn text into bloob
 * @param {String} textin content of blob
 * @param {String} mime mime of blob
 * @returns {String} url
 */
function to_blob(textin, mime = "text/plain"){
    testin(textin, "string");
    testin(mime, "string");
    const blob = new Blob([textin], {type : mime});
    console.log(blob);
    const url = URL.createObjectURL(blob);
    return url;
}

/**
 * function to create link (stylesheet) element
 * @param {string} url url of css file
 * @returns {HTMLLinkElement}
 */
function create_csstag(url){
    const link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", url);
    return link;
}

/**
 * function to make css from string
 * @param {String} css css code
 */
function add_css(css){
    const url = to_blob(css, "text/css");
    document.head.appendChild(create_csstag(url));
}