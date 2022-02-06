/*@licstart  The following is the entire license notice for the 
JavaScript code in this page.

Copyright (C) 2022 Vojtech Varecha

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
window.addEventListener("settingsloaded", onsettingsloaded);

function onsettingsloaded(){
    document.getElementById("logoutbutton").addEventListener("click", logout);
}

function logoutcallback(resText){
    if(resText != ""){
        res = JSON.parse(resText);
        if(res.estate == 0 & res.result == "ok"){
            localStorage.removeItem("account");
            location.href = "index.html";
        }else{
            console.error("unknown error");
            console.error(res);
        }
    }else{
        console.error(resText);
    }
}

function logouterrorcallback(status, resText){
    if(resText != ""){
        res = JSON.parse(resText);
        console.error(status, res);
    }else{
        console.error(resText);
    }
}

/**
 * function to try loging in
 * @param {string} email 
 * @param {string} password
 * @param {Function} callback
 * @param {Function} callbackerror
 */
function logout(){
    ajax(window.api.endpoints.logout, "POST", logoutcallback, "", logouterrorcallback);    
}