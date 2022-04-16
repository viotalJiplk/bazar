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

/**
 * converts base64url to Uint6Array
 * @param {String} string base64url string
 * @returns {Array} Array of numbers representing binary - word = 6 bits
 */
function b64urltouint6(string){
    const u64enc = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_"]
    const uint6 = [];
    for(i = 0; i < string.length; i++){
        if(string.charAt(i) != "="){
            uint6.push(u64enc.indexOf(string.charAt(i)))
        }
    }
    return uint6;
}
/**
 * converts Uint6Array to 
 * @param {Array} uint6 Uint6Array to convert
 * @returns {Uint8Array} converted Array
 */
function uint6touint8(uint6){
    let uint8 = new Array();
    for(i = 0; i < uint6.length; i += 4){
        let value = 0;
        for(j = 0; (j + i) < uint6.length & j<4; j++){
            value <<= 6;
            value += uint6[i + j];
            if(uint6.length - i <4 &(j + i + 2) == uint6.length){
                if(j == 0) {    //if the number of bits wasn't multiple of 24 it was padded wit 00
                    value <<= 2;
                    value += uint6[i+j+1] >> 4;
                    j++;
                } else {
                    value <<= 4;
                    value += uint6[i + j + 1]>>2;
                    j++;
                }
                
            }
        }
        let helperarray = Array();
        for(j = 4; j > 0 & value > 0; j--){
            helperarray.unshift(value % 256);
            value >>= 8;
        }
        helperarray.forEach(record=>{
            uint8.push(record);
        })
    }
    return Uint8Array.from(uint8);
}

/**
 * converts base64url string to UTF-8
 * @param {String} b64 base64url 
 * @returns {String} decoded string
 */
function b64toutf8(b64){
    let utf8decoder = new TextDecoder();
    let array = uint6touint8(b64urltouint6(b64));
    return utf8decoder.decode(array);
}

/**
 * function to parse jwt
 * @param {String} jwt 
 */
function parse_jwt(jwt) {
    jwt = jwt.split(".")
    return JSON.parse(b64toutf8(jwt[1]));
}