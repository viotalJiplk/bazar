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

window.addEventListener("navloaded", on_ajaxload);

/**
 * this happens after ajax is loaded
 */
function on_ajaxload(){
    let testapi = localStorage.getItem("api");
    if(testapi == "" | testapi == null){
        ajax("endpoints/","GET",callbackfunc);
    }else{
        window.api = JSON.parse(testapi);
        trylogingin()
    }
}

/**
 * if user is logged in changes "přihlášení" to "účet" and populates window.account
*/
function trylogingin(){
    let account = localStorage.getItem("account");
    if(account != "" & account != null){
        window.account = JSON.parse(account);
        document.getElementById("login").innerText = "Účet";
        document.getElementById("login").setAttribute("href", "account.html");
    }
    window.dispatchEvent(settingsloaded);
}

/**
 * callback function to remove button from frontend after sucessful backand remove
 * @param {string} resText body of http response
 */
function callbackfunc(resText){
    localStorage.setItem("api", resText);
    window.api = JSON.parse(resText);
    window.dispatchEvent(settingsloaded);
    trylogingin()
}