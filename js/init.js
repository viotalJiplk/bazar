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

eventmanager.addEventListener("navloaded", on_ajaxload);

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
    let unprocessed_jwt = localStorage.getItem("jwt");
    if(unprocessed_jwt != "" & unprocessed_jwt != null){
        let jwt = parse_jwt(unprocessed_jwt);
        if((jwt.exp * 1000) > Date.now()){
            //lets prepare enviroment
            window.jwt = jwt;
            window.account = {
                "uid": jwt.eu_viotal_bazar_uid,
                "email": jwt.eu_viotal_bazar_email,
                "uname": jwt.eu_viotal_bazar_uname
            }
            window.encodedjwt = unprocessed_jwt;
            document.getElementById("login").innerText = "Účet";
            document.getElementById("login").setAttribute("href", "account.html");
        }else{  //the jwt is no longer valid
            localStorage.removeItem("jwt");
        }
    }
    window.dispatchEvent(eventmanager.event.settingsloaded);
}

/**
 * callback function to remove button from frontend after sucessful backend remove
 * @param {string} resText body of http response
 */
function callbackfunc(resText){
    localStorage.setItem("api", resText);
    window.api = JSON.parse(resText);
    window.dispatchEvent(eventmanager.event.settingsloaded);
    trylogingin()
}
