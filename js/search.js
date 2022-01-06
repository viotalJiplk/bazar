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

/**
 * function to do request to server for records
 */
function search(){
    const cat = document.getElementById("id_cat").value;
    const price_from = document.getElementById("id_price_from").value;
    const price_to = document.getElementById("id_price_to").value;
    const from_date = document.getElementById("id_pub_date").value;
    let json = {
        "cat": cat,
        "price_from": price_from,
        "price_to": price_to,
        "from_date": from_date
    }
    json = JSON.stringify(json);
    console.log(json);
    ajax("search.php", "POST", callback_search, json)
}

/**
 * push records to website
 * @param {string} resText json of records
 */

function callback_search(resText){
    const json = JSON.parse(resText);
    document.getElementById("content").innerHTML = "";
    add_records(json);
}

search();