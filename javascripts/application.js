/*jslint white: true, browser: true, devel: true, onevar: true, undef: true,
 nomen: false, eqeqeq: true, plusplus: false, bitwise: true, regexp: true,
 newcap: true, immed: true, maxlen: 80, indent: 4 */
/*globals
    $: false,
    _: false,
    Models: false,
    Views: false,
    Controllers: false,
    window: false
*/
/*
 * application.js
 *
 * Avalanche Project (http://avalanche-bt.com)
 *
 * This code is licensed under the GPL3, or
 * "GNU GENERAL PUBLIC LICENSE Version 3"
 * For more details, see http://opensource.org/licenses/gpl-3.0.html
 *
 * @author Keith Cirkel ('keithamus') <avalanche@keithcirkel.co.uk>
 * @license http://opensource.org/licenses/gpl-3.0.html
 * @copyright Copyright © 2011, Keith Cirkel
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
(function loadScripts() {
    var ajax = new XMLHttpRequest();
    ajax.overrideMimeType("application/json");
    ajax.open('GET', 'javascripts/manifest.json', true);
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4) {
            var json = JSON.parse(ajax.responseText),
                scripts = json.files.all.concat(json.files.development),
                firstscript = document.getElementsByTagName('script')[0],
                i = 0, script, loadScript;
                
            loadScript = function loadScript() {
                if (scripts[i] === undefined) {
                    return;
                }
                var done = false;
                script = document.createElement('script');
                script.src = scripts[i];
                script.type = 'text/javascript';
                script.onload = script.onreadystatechange = function () {
                    var state = script.readyState;
                    if (!done && (!state || /loaded|complete/.test(state))) {
                        done = true;
                        ++i;
                        script.onload = script.onreadystatechange = null;
                        loadScript();
                    }
                };
                firstscript.parentNode.insertBefore(script, firstscript);
            };
            loadScript();
        }
    };
    
    ajax.send(null);
}());