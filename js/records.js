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
 * inserts records to page 
 * @param {Object} records js object with records 
 */

function add_records(records){
    const cnt = document.getElementById("content");
    records.forEach(element => {
        if(typeof(element.pic) == 'undefined' || element.pic == null){
            element.pic = "";
        }else{
            element.pic = "pictures/" + element.pic;
        }
        let text = "<div id=\""+ element.id +"\" class=\"record\"><img src=\"" + element.pic + "\"></img><p>Kontakt: <a href=\"mailto://" + element.email + "\">"+ element.email +"</a></p><p>Kategorie: " + element.cat + "</p><p>Popis: </p><p>" + element.descr + "</p><p>Cena: " + element.price + " Kč</p></div>";
        cnt.innerHTML = cnt.innerHTML + text;
    });

}
