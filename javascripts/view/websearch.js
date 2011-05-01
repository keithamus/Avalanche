/*jslint white: true, browser: true, devel: true, onevar: true, undef: true,
 nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true,
 newcap: true, immed: true, maxlen: 80, indent: 4 */
/*globals
    $: false,
    Templates: false,
    Models: false,
    Views: false,
    Controllers: false,
    window: false
*/
/*
 * view/websearch.js
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

Views.Websearch = $.view.extend({

    el: $('#toolbar_search'),

    websearch: {
        button: $('#toolbar_search_dropdown'),
        input:  $('#toolbar_search_input')
    },

    initialize: function () {
        $.info('Initialising Views.Websearch');

        // Bind our model to this view.
        this.model.bind('change', this.render);
        this.model.view = this;

        this.render();
    },

    render: function () {
        $.debug('Setting search engine to ', this.model.current);
        this.setDropdownImage(this.model.current);
    },

    events: {
        'click #toolbar_search_dropdown':  'clickDropdown',
        'keyup #toolbar_search_input': 'keyupInput'
    },

    clickDropdown: function () {
        $.info('Clicked #toolbar_search_dropdown');

        this.dropdown = new Views.Dropdown({
            id: 'toolbar_search_choices',
            x: this.el.offset().left,
            y: this.el.offset().top + this.el.outerHeight(true),
            choices: this.model
        })
        // Bind to the "selected" trigger on the dropdown view, which triggers
        // when the user clicks an option from the dropdown
        .bind('selected', $.u.bind(this.changeCurrentWebsearch, this));
    },

    keyupInput: function (e) {
        var url, key = e.keyCode, value = this.websearch.input.val();

        // User pressed enter
        switch (key) {
        case 13: //enter/carriage return
            this.openSearchWindow(value);
            break;
        case 8: //backspace
            break;
        case 27: //esc
            this.websearch.input.val('').blur();
            break;
        default:
            break;
        }
    },

    openSearchWindow: function (search) {
        var url = this.model.current.attributes.url.replace('%s', search);
        window.open(url, 'search');
    },

    changeCurrentWebsearch: function (dropdown, args) {
        this.model.current = this.model.getByCid(args.id);
        this.render();
    },

    setDropdownImage: function (model) {
        this.websearch.button.css({
            backgroundImage: 'url(' + model.attributes.favicon + ')'
        });
    }

});
