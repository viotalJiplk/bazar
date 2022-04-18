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
            
            let p = document.createElement("p");
            let a = document.createElement("a");
            let name = document.createElement("h4");
            name.innerText = element.name;
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

            record.appendChild(name);

            if(element.pic !== null & element.pic != ""){
                let img = document.createElement("img");
                img.addEventListener("click",function(e) {
                    console.log(e.target);
                    change_photores(e.target);               
                });

                img.setAttribute("src", element.pic);
                record.appendChild(img);
            }

            record.appendChild(contact);

            if(element.phone !== null){
                let phone = p.cloneNode();
                phone.innerText = "Tel. číslo: " + element.phone
                record.appendChild(phone);
            }

            if(element.loc !== null){
                let loc = p.cloneNode();
                loc.innerText = "Lokalita: " + element.loc
                record.appendChild(loc);
            }

            record.appendChild(descr);
            record.appendChild(price);

            record.setAttribute("id", "div_" + element.id);
            record.setAttribute("data-uid", element.uid);
            let rmbutton = document.createElement("button");
            rmbutton.innerText = "remove";
            rmbutton.addEventListener("click", function(e){rmbuttonf(e.target.getAttribute("id"))});
            rmbutton.setAttribute("id", element.id);
            rmbutton.setAttribute("data-uid", element.uid);

            record.appendChild(rmbutton);

            cnt.appendChild(record);
        });
    }
}

/**
 * function to remove record
 * @param {string} id id of record
 */
function rmbuttonf(id){
    payload = {
        "id": id
    }
    let recuid = document.getElementById("div_" + id).getAttribute("data-uid"); 
    if(typeof window.account !== "undefined"){
        if(recuid != window.account.uid){
            payload.passwd = prompt("Zadejte heslo.");
            if(payload.passwd != null){
                togle_waiting_sign(1);
                ajax(window.api.endpoints.remove, "POST", rmbuttoncallback, JSON.stringify(payload), rmbuttonerrorcallback);
            }
        }else{
            togle_waiting_sign(1);
            array = new Array();
            array["Authorization"] = "Bearer " + window.encodedjwt;
            ajax(window.api.endpoints.remove, "POST", rmbuttoncallback, JSON.stringify(payload), rmbuttonerrorcallback , array);
        }
    }else{
        payload.passwd = prompt("Zadejte heslo.");
        if(payload.passwd != null){
            togle_waiting_sign(1);
            ajax(window.api.endpoints.remove, "POST", rmbuttoncallback, JSON.stringify(payload), rmbuttonerrorcallback);
        }
    }
}

/**
 * callback function to remove button from frontend after sucessful backend remove
 * @param {string} resText body of http response
 */
function rmbuttoncallback(resText){
    togle_waiting_sign(0);
    if(resText != ""){
        let res = JSON.parse(resText);
        if(res.estate == 0 & res.result == "ok"){
            document.getElementById("div_" + res.id).textContent="";
            alert("odstraněno");
        }else{
            console.error("unknown error");
            console.error(res);
        }
    }else{
        console.error(resText);
    }
}

/**
 * callback for error while removing
 * @param {number} status http status code
 * @param {string} resText text, with which server responded 
 */
function rmbuttonerrorcallback(status, resText){
    togle_waiting_sign(0);
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


/**
 * function to change img size (maximize or minimize)
 * @param {HTMLImageElement} img img to be changed size of
 */
function change_photores(img){
    if(!img.classList.contains("img-max")){
        img.classList.add("img-max");
        document.getElementById("bg").style.visibility = "visible";
    }else{
        img.classList.remove("img-max");
        document.getElementById("bg").style.visibility = "hidden";
    }
}