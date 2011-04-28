/*jslint white: true, browser: true, devel: true, onevar: true, undef: true,
 nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true,
 newcap: true, immed: true, maxlen: 80, indent: 4 */
/*globals
    $: false,
    _: false,
    Templates: false,
    Models: false,
    Views: false,
    Controllers: false,
    window: false
*/
/*
 * views/toolbar.js
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

Views.Toolbar = $.view.extend({

    el: $('#toolbar'),

    toolbar: {
        buttons: $('#toolbar_buttons_list'),
        search:  $('#toolbar_search')
    },

    toolbar_buttons: [
        {
            type: 'button',
            id: 'open',
            text: $.R('toolbar.buttons.open')
        },
        {   type: 'separator' },
        {
            type: 'button',
            id:   'remove',
            text: $.R('toolbar.buttons.remove')
        },
        {
            type: 'button',
            id: 'resume',
            text: $.R('toolbar.buttons.resume')
        },
        {
            type: 'button',
            id:   'pause',
            text: $.R('toolbar.buttons.pause')
        },
        {   type: 'separator' },
        {
            type: 'button',
            id:   'resume_all',
            text: $.R('toolbar.buttons.resume_all')
        },
        {
            type: 'button',
            id:   'pause_all',
            text: $.R('toolbar.buttons.pause_all')
        },
        {   type: 'separator' },
        {
            type: 'button',
            id:   'about',
            text: $.R('toolbar.buttons.about')
        },
        {
            type: 'button',
            id:   'preferences',
            text: $.R('toolbar.buttons.preferences')
        }
    ],

    initialize: function () {
        $.log('Initialised toolbar View');
        this.render();
    },

    render: function () {

        var html = '', button = '';

        $.log('Rendering toolbar buttons', this.toolbar_buttons);

        _.each(this.toolbar_buttons, function (button) {
            html += $.tmpl(
                Templates.toolbar[button.type], button);
        });

        return this.toolbar.buttons.html(html);
    },

    events: {
        'click #open':  'clickOpen',
        'click #remove': 'clickRemove',
        'click #resume': 'clickResume',
        'click #pause': 'clickPause',
        'click #resume_all': 'clickResumeAll',
        'click #pause_all': 'clickPauseAll',
        'click #about': 'clickAbout',
        'click #preferences': 'clickPreferences'
    },

    clickOpen: function () {

    },

    clickRemove: function () {

    },

    clickResume: function () {

    },

    clickPause: function () {

    },

    clickResumeAll: function () {

    },

    clickPauseAll: function () {

    },

    clickAbout: function () {

    },

    clickPreferences: function () {

    }

});