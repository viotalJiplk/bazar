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
window.addEventListener("settingsloaded", onsettingsloaded);

/**
 * this happens after settings is loaded
 */
function onsettingsloaded(){
    document.getElementById("logoutbutton").addEventListener("click", logout);
    if(window.account != null){
        document.getElementById("email").innerText = account.email;
        document.getElementById("uname").innerText = account.uname;
    }
}

/**
 * function to process response of http logout request
 * @param {String} responseText body of http response
 */
function logoutcallback(resText){
    if(resText != ""){
        res = JSON.parse(resText);
        if(res.estate == 0 & res.result == "ok"){
            localStorage.removeItem("jwt");
            location.href = "index.html";
        }else{
            console.error("unknown error");
            console.error(res);
        }
    }else{
        console.error(resText);
    }
}

/**
 * function to process response of http logout request error
 * @param {String} responseText body of http response
 * @param {number} status http response code
 */
function logouterrorcallback(status, resText){
    if(resText != ""){
        res = JSON.parse(resText);
        console.error(status, res);
    }else{
        console.error(resText);
    }
}

/**
 * function to try loging out
 */
function logout(){
    ajax(window.api.endpoints.logout, "POST", logoutcallback, "", logouterrorcallback);    
}