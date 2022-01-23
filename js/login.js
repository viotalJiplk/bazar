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

document.getElementById("submitbutton").addEventListener("click", getlogincredentials);

/**
 * function to extract login informations from page
 */
function getlogincredentials(){
    email = document.getElementById("email").value;    
    password = document.getElementById("password").value;
    login(email, password, logincallback, loginerrorcallback);
}

function logincallback(resText){
    if(resText != ""){
        res = JSON.parse(resText);
        if(res.estate == 0 & res.result == "ok"){
            localStorage.setItem("account", JSON.stringify({email: res.email}));
            location.href = "index.html";
        }else{
            console.error("unknown error");
            console.error(res);
        }
    }else{
        console.error(resText);
    }
}

function loginerrorcallback(status, resText){
    if(resText != ""){
        res = JSON.parse(resText);
        if(status == 403 & res.estate == 1){
            if(res.msg == "Wrong email or password."){
                res.msg = "špatný email nebo uživatelské jméno";
            }else if(res.msg == "already logged in"){
                res.msg = "už jste přihlášený"
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

/**
 * function to try loging in
 * @param {string} email 
 * @param {string} password
 * @param {Function} callback
 * @param {Function} callbackerror
 */
function login(email, password, callback, callbackerror){
    if(email == "" | password == ""){
        window.dispatchEvent(loginfailed)
    }else{
        payload = {
            "email":email,
            "password":password
        }
        ajax(window.api.endpoints.login, "POST", callback, JSON.stringify(payload), callbackerror)    
    }
}