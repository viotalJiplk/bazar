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

/**
 * function to handle ajax (using XMLHttpRequest object)
 * @param {string} url where to ask for resource url of this server would be the base for exp. https://spgt.online + url - it shuld begin with /
 * @param {string} method http method (GET, POST, PUT etc..)
 * @param {Function} callback function to call after request is done (text of response would be passed as parameter)
 * @param {string} payload payload of httprequest
 * @param {Function} errorcallback function to call if request failed (http response code != 200) (parameters [response code, response text])
 * @param {Array} headers http headers
 * @throws httpStatusCode on error
 */

function ajax(url, method, callback, payload = "", errorcallback = console.error, headers = []){
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4) {
            if(this.status == 200){    
                if(typeof callback == "function"){
                    callback(this.responseText );
                }else{
                    console.log(this.responseText);
                }
            }else{
                if(typeof errorcallback == "function"){
                    errorcallback(this.status, this.responseText);
                }else{
                    console.error(this.status, this.responseText);
                }
                console.error(this.status);
            }
        }
    }
    xhttp.open(method, url , true);
    for(i = 0; i < headers.length; i++){
        xhttp.setRequestHeader(headers[i][0], headers[i][1]);
    }
    xhttp.send(payload);
}

window.dispatchEvent(ajaxloaded);