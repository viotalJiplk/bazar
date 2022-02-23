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

lastoffset = 0;
limit = 50;

window.addEventListener("settingsloaded", onsettingsloaded);

/**
 * this happens after settings is loaded
 */
function onsettingsloaded(){
    document.getElementById("submitbutton").addEventListener("click", function(){search()});
    search();
}

/**
 * function to do request to server for records
 * @param {number} offset offset from first possible result
 */
function search(offset = 0){
    const cat = document.getElementById("id_cat").value;
    const price_from = document.getElementById("id_price_from").value;
    const price_to = document.getElementById("id_price_to").value;
    const from_date = document.getElementById("id_pub_date").value;
    limit = Number(document.getElementById("limit").value);
    let json = {
        "cat": cat,
        "price_from": price_from,
        "price_to": price_to,
        "from_date": from_date,
        "limit": limit,
        "offset": offset
    }
    json = JSON.stringify(json);
    console.log(json);
    ajax(window.api.endpoints.search, "POST", callback_search, json)
}

/**
 * push records to website
 * @param {string} resText json of records
 */
function callback_search(resText){
    if(resText != ""){
        res = JSON.parse(resText);
        if(res.estate == 0 & res.result == "ok"){
            const json = JSON.parse(resText);
            document.getElementById("records").innerHTML = "";
            add_records(json.response);
            document.getElementById("page_navigation").innerHTML ="";
            if(json.request.offset >0){
                a_previouspage = document.createElement("a");
                a_previouspage.addEventListener("click", function(){
                    lastoffset = lastoffset - limit;
                    if(lastoffset < 0){
                        lastoffset = 0;
                    }
                    console.log(lastoffset);
                    search(lastoffset);
                });
                a_previouspage.innerHTML ="<- předchozí stránka";
                a_previouspage.setAttribute("href", "#content");
                document.getElementById("page_navigation").appendChild(a_previouspage);
            }
            if(json.request.offset >0 & json.request.limit == json.response.length){
                p = document.createElement("p");
                p.innerHTML = "|";
                document.getElementById("page_navigation").appendChild(p);
            }
            if(json.request.limit == json.response.length){
                a_nextpage = document.createElement("a");
                a_nextpage.addEventListener("click", function(){lastoffset += json.request.limit;search(lastoffset)});
                a_nextpage.innerHTML ="další stránka ->";
                a_nextpage.setAttribute("href", "#content");
                document.getElementById("page_navigation").appendChild(a_nextpage);
            }
        }else{
            console.error("unknown error");
            console.error(res);
        }
    }else{
        console.error(resText);
    }
}