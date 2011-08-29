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
 * model/preferences.js
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

Models.Preferences = $.model.extend({

    // Define our storage method (localStorage, not REST)
    sync: $.localSync,

    initialize: function () {

    },

    toString: function () {
        return JSON.stringify(this);
    }

});

Models.PreferencesCollection = $.collection.extend({

    // Bind to our model:
    model: Models.Preferences,

    // Define our storage method (localStorage, not REST)
    sync: $.localSync,
    localStorage: new $.localStore('pref'),

    // A convenience object to quickly fetch the model requested
    byParentCid: {},

    // When initialised, check if localStorage is empty, if so supply some
    initialize: function () {
        $.info('Initialising Models.PreferencesCollection');

        // Fetch our potential prefs from localStorage
        this.fetch();
    },

    // Set the value of `name` to `value`
    setPref: function (self, name, value) {
        var setter = {};
        this.checkPref(self.cid, name);
        setter[name] = value;
        this.byParentCid[self.cid].save(setter);
    },

    // Get the value of `name`
    getPref: function (self, name) {
        return this.checkPref(self.cid, name);
    },

    // Assert wether the value of `name` is equal to `value`
    assertPref: function (self, name, value) {
        return this.checkPref(self.cid, name) === value;
    },

    // Remove a preference
    removePref: function (self, name, value) {
        if (this.checkPref(self.cid, name)) {
            this.byParentCid[self.cid].unset(name);
        }
    },

    // Check to see if model exists, if so return the value for `name`
    checkPref: function (id, name) {
        if (!this.byParentCid[id]) {
            this.add({'.id': id});
            this.byParentCid[id] = this.last();
            return false;
        }

        return this.byParentCid[id].get(name);
    }

});