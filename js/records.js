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

const recorddiv = document.createElement("div");
recorddiv.setAttribute("class", "record");

/**
 * inserts records to page 
 * @param {Object} records js object with records 
 */

function add_records(records){
    const cnt = document.getElementById("records");
    if(records.forEach != undefined){
        records.forEach(element => {
            let record = recorddiv.cloneNode();
            if(typeof(element.pic) == 'undefined' || element.pic == null){
                element.pic = "";
            }else{
                element.pic = "pictures/" + element.pic;
            }
            record.innerHTML = "<img src=\"" + element.pic + "\"></img><p>Kontakt: <a href=\"mailto://" + element.email + "\">"+ element.email +"</a></p><p>Kategorie: " + element.cat + "</p><p>Popis: </p><p>" + element.descr + "</p><p>Cena: " + element.price + " Kč</p>";
            record.setAttribute("id", element.id);
            let rmbutton = document.createElement("button");
            rmbutton.innerText = "remove";
            rmbutton.addEventListener("click", function(e){rmbuttonf(e.target.getAttribute("id"))});
            rmbutton.setAttribute("id", element.id);

            record.appendChild(rmbutton);

            cnt.appendChild(record);
        });
    }
}

function rmbuttonf(id){
    let passwd = prompt("Zadejte heslo.");
    console.log(id);
    payload = {
        "passwd": passwd,
        "id": id
    }
    ajax(window.api.endpoints.remove, "POST", rmbuttoncallback, JSON.stringify(payload), rmbuttonerrorcallback);
}
function rmbuttoncallback(resText){
    if(resText != ""){
        res = JSON.parse(resText);
        if(res.estate == 0 & res.result == "ok"){
            alert("odstraněno");
        }else{
            console.error("unknown error");
            console.error(res);
        }
    }else{
        console.error(resText);
    }
}

function rmbuttonerrorcallback(status, resText){
    if(resText != ""){
        res = JSON.parse(resText);
        if(status == 403 & res.estate == 1){
            if(res.msg == "Wrong password."){
                res.msg = "Špatné heslo.";
            }
            alert(res.msg);
        }else{
            console.error(status, res);
        }
    }else{
        console.error(resText);
    }
}