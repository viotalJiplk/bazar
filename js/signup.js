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

/**
 * this happens after settings is loaded
 */
function onsettingsloaded(){
    document.getElementById("submitbutton").addEventListener("click", signup)
}

/**
 * function to try to sign up
 */
function signup(){
    email = document.getElementById("email").value;    
    password = document.getElementById("password").value;
    username = document.getElementById("username").value;

    if(email == "" | password == "" | username == ""){
        signuperrorcallback(403,"{\"estate\":1, \"msg\":\"Chybí email nebo heslo nebo uživatelské jméno\"}");
    }else{
        payload = {
            "email": email,
            "password": password,
            "username": username
        };
        ajax(window.api.endpoints.signup, "POST", signupcallback, JSON.stringify(payload), signuperrorcallback);   
    }
}

/**
 * function to respond to http sucess on login try
 * @param {String} responseText body of http response
 */
function signupcallback(resText){
    if(resText != ""){
        res = JSON.parse(resText);
        if(res.estate == 0 & res.result == "ok"){
            localStorage.setItem("jwt", res.jwt);
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
 * callback for error while trying to create an account
 * @param {number} status http status code
 * @param {string} resText text, with which server responded 
 */
function signuperrorcallback(status, resText){
    if(resText != ""){
        res = JSON.parse(resText);
        if(status == 403 & res.estate == 1){
            if(res.msg == "email or username is alredy in database"){
                res.msg = "email nebo uživatelské jméno již bylo zaregistrováno";
            }
            res.msg = "Chyba: " + res.msg
            document.getElementById("loginerror").firstElementChild.innerText = res.msg;
            document.getElementById("loginerror").style.visibility = "visible";
        }else{
            console.error(status, res);
        }
    }else{
        console.error(resText);
    }
}