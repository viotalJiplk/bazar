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

eventmanager.addEventListener("settingsloaded", onsettingsloaded);

/**
 * this happens after settings is loaded
 */
function onsettingsloaded(){
    if(window.account != null){
        document.getElementById("notlogedin").style.display = "none";
        document.getElementById("id_name").setAttribute("readonly", "readonly");
        document.getElementById("id_name").value = window.account.uname;
        document.getElementById("id_email").setAttribute("readonly", "readonly");
        document.getElementById("id_email").value = window.account.email;
    }
    document.getElementById("upload_picture_button").addEventListener("click", upload_photo);
    document.getElementById("upload_record").addEventListener("click", insert);
}

/**
 * inserts record into db
 */
function insert(){
    let headers = [];
    let json = {
        "cat": document.getElementById("id_cat").value,
        "descr": document.getElementById("id_descr").value,
        "price": Number(document.getElementById("id_price").value),
        "name": document.getElementById("id_name").value
    }

    if(document.getElementById("id_phone").value != ""){
        json.phone = document.getElementById("id_phone").value;
    }

    if(document.getElementById("id_loc").value != ""){
        json.loc = document.getElementById("id_loc").value;
    }

    if(window.jwt != null){
        headers["Authorization"] = "Bearer " + window.encodedjwt;
    }else{
        json.email = document.getElementById("id_email").value;
        json.passwd = document.getElementById("id_passwd").value;
    }
    if(window.upload){
        json.picture = window.upload;
    }
    if(json.name !== undefined, json.cat !== undefined & json.price !== undefined & json.descr != "" & (headers["Authorization"] !== undefined | (json.email != "" & json.passwd != ""))){
        if(json.price != 0){
            json = JSON.stringify(json);
            togle_waiting_sign(1);
            ajax(window.api.endpoints.insert, "POST", callback_insert, json, error_callback_insert, headers);
        }else{
            if(confirm("Opravdu chcete zadat nab??dku s cenou 0 K???")){
                json = JSON.stringify(json);
                togle_waiting_sign(1);
                ajax(window.api.endpoints.insert, "POST", callback_insert, json, error_callback_insert, headers);
            }
        }
    }else{
        if(json.cat === undefined){
            alert("Chyba: Nen?? zad??na kategorie.");
        }else if(json.price === undefined){
            alert("Chyba: Nen?? zad??na cena.");
        }else if(json.descr == ""){
            alert("Chyba: Nen?? zad??n popis.");
        }else if(headers["Authorization"] === undefined & json.passwd == ""){
            alert("Chyba: Nen?? zad??no heslo.");
        }else if(headers["Authorization"] === undefined & json.email == ""){
            alert("Chyba: Nen?? zad??n email.");
        }else if(headers["Authorization"] !== undefined){
            alert("Chyba: Zkuste se odhl??sit a p??ihl??sit. Kontaktujte podporu.");
        }else{
            alert("Nezn??m?? chyba: Kontaktujte podporu.");
        }
    }
}

function rm_session(){
    localStorage.removeItem("jwt");
    location.href = "index.html";
}

/**
 * function to provide feedback to user on upload/insert function
 * @param {String} responseText body of http response
 */
function callback_insert(responseText){
    togle_waiting_sign(0);
    let json = JSON.parse(responseText);
    if(json.status == "ok"){
        // const div = create_status_div("nahr??no", 0);
        // const log_div = document.getElementById("log");
        // log_div.appendChild(div);
        window.upload = json.name;
        alert("nahr??no");
    }else{
        // console.log("error occurred");
        // console.log(json);
        // const div = create_status_div("error", 1);
        // const log_div = document.getElementById("log");
        // log_div.appendChild(div);
        if(json.msg == "not logged in"){
            alert("Chyba: Kontaktujte pros??m podporu");
            rm_session();
        }else if(json.msg == "Invalid email."){
            alert("Chyba: ??patn?? zadan?? email.");
        }else{
            alert("Nezn??m?? chyba kontaktujte pros??m podporu");
        }
    }
}

function error_callback_insert(res){
    console.error(res);
    togle_waiting_sign(0)
    alert("Nezn??m?? chyba kontaktujte pros??m podporu");
}

/**
 * function to create status div
 * @param {String} status status to be shown in div
 * @param {Number} statu_code  indicates status of code < 0 => error
 * @returns {HTMLDivElement} statusdiv
 */

function create_status_div(status, statu_code){
    const div = document.createElement("div");
    const p = document.createElement("p");
    div.classList.add("statusdiv");
    div.setAttribute("data-status", status);
    p.innerText = status;
    div.appendChild(p);
    if(!statu_code){
        div.classList.add("statusok");
    }else{
        div.classList.add("statuserror");
    }
    return div;
}

/**
 * uploads photo using PUT
 */
function upload_photo(){
    const pic = document.getElementById("id_pic").files[0];
    ajax(window.api.endpoints.upload_picture, "PUT", callback_insert, pic);    
}