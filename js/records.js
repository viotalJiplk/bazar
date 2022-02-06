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
            let img = document.createElement("img");
            img.addEventListener("click",function(e) {
                console.log(e.target);
                change_photores(e.target);               
            });

            img.setAttribute("src", element.pic);
            let p = document.createElement("p");
            let a = document.createElement("a");
            a.setAttribute("href","mailto://" + element.email);
            a.innerText = element.email;
            let contact = p.cloneNode();
            let cnode = document.createTextNode("Kontakt: ");
            contact.appendChild(cnode);
            contact.appendChild(a);
            let descr = p.cloneNode();
            descr.innerText = "Popis: " + element.descr;

            let price = p.cloneNode();
            price.innerText = "Cena: " + element.price + " Kč";

            record.appendChild(img);
            record.appendChild(contact);
            record.appendChild(descr);
            record.appendChild(price);

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

function change_photores(img){
    if(!img.classList.contains("img-max")){
        img.classList.add("img-max");
        document.getElementById("bg").style.visibility = "visible"
    }else{
        img.classList.remove("img-max");
        document.getElementById("bg").style.visibility = "hidden"
    }
}