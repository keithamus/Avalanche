/*jslint white: true, browser: true, devel: true, onevar: true, undef: true,
 nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true,
 newcap: true, immed: true, maxlen: 80, indent: 4 */
/*globals
    $: false,
    templates: false,
    Models: false,
    Views: false,
    Controllers: false,
    window: false
*/
/*
 * controller/application.js
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

Controllers.Application = $.controller.extend({

    App: {
        Controllers: {},
        Models: {},
        Views: {}
    },

    routes: {
        '':  'index',
        'torrent/:id':  'torrent'
    },
    
    index: function () {},

    index: function () {
        $.info('Initialising Controllers.Application');

        this.App.Controllers = {
        };

        this.App.Models = {
            Websearch: new Models.WebsearchCollection()
        };

        this.App.Views = {
            Toolbar: new Views.Toolbar(),
            Websearch: new Views.Websearch({
                model: this.App.Models.Websearch
            })
        };
    }

});