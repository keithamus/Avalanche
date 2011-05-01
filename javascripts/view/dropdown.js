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
 * view/dropdown.js
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

Views.Dropdown = $.view.extend({

    el: '',

    // Some defaults:
    id: 'dropdown-' + Number(new Date()),
    x: 0,
    y: 0,
    choices: {},
    selection: false,

    initialize: function () {
        $.info('Initialising Views.Dropdown');

        // Set some of our options in this
        $.u.extend(this, this.options);

        // Add the dropdown#id HTML to <body>
        $('body').append(this.render());

        // Bind the dropdown#id DOM to this.el
        this.el = $('#' + this.id);

        //Set our X and Y on the dropdown
        this.setPos();

        // Delegate our events out from our new this.el
        this.delegateEvents();
    },

    render: function () {

        var self = this, html = '', choice = '', id = this.id;

        $.debug('Rendering dropdown options', this.choices);

        // Add the #dropdown div wrapper to HTML:
        html = $.tmpl(Templates.dropdown.start, {id: this.id});

        //Check if we need to iterate over a model or object
        if (this.choices.each) {
            this.choices.each(function (choice) {
                html += self.renderChoice(id, choice, true);
            });
        } else {
            $.u.each(this.choices, function (choice) {
                html += self.renderChoice(id, choice);
            });
        }

        return html + Templates.dropdown.end;
    },

    events: {
        'click li':  'clickOption'
    },

    // When an option is clicked, trigger the `selected` binding and destroy the
    // dropdown
    clickOption: function (e) {
        var id = $(event.target).parent().attr('id').replace(this.id + '-', '');
        this.trigger('selected', this, {id: id});
        this.destroy();
        return id;
    },

    // Sets the `top` and `left` of the dropdown based on this.x, this.y
    setPos: function () {
        $.debug('Setting #' + this.id + ' left:' + this.x + ', top:' + this.y);
        this.el.css({top: this.y + 'px', left: this.x + 'px'});
    },

    renderChoice: function (mainid, choice, isModel) {
        return $.tmpl(Templates.dropdown[choice.type || 'option'], {
            id: mainid + '-' + (isModel ? choice.cid : choice.id),
            text: (isModel ? choice.toString() : choice.text),
            icon: (isModel ? choice.getIconURL() : choice.icon)
        });
    },

    destroy: function () {
        this.el.remove();
    }

});