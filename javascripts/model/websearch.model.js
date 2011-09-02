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
 * model/websearch.model.js
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

Models.Websearch = $.model.extend({

    // Define our storage method (localStorage, not REST)
    sync: $.localSync,

    // Defaults for the Websearch object.
    defaults: {
        name: 'Search',
        url:  '',
        favicon: ''
    },

    // This is the URL for the favicon generator
    faviconUrl: 'http://www.google.com/s2/favicons?domain=%(domain)',

    // This is our regexp to match a domain
    matchDomain: new RegExp("^(?:https?\\:\\/\\/)" + // Protocol (http(s))
                            "(?:\\w+\\.)?" + // Subdomain (e.g www)
                            "((?:\\w+\\.)(?:\\w{2,6}))" + // Domain and TLD
                            "(?:\/[\\?\\=\\:\\&\\/\\w\\-_]+)?"), // Routing

    initialize: function () {
        // If the URL is supplied already, but the favicon isn't, then set it
        if (this.get('url')) {
            this.setFavicon();
        }
    },

    // Validate the model data when changed (must have a domain, contain a %s)
    validate: function (attrs) {
        var match;
        // Has the URL changed?
        if (attrs.url) {
            // Try to match against this.matchDomain
            match = attrs.url.match(this.matchDomain);

            // No match? Not a valid domain then
            if (match === null || match.length !== 2) {
                $.debug('Supplied URL matched to `null`');
                return 'Invalid URL supplied';

            // Does the URL contain %s? We need %s to perform searches.
            } else if (attrs.url.indexOf('%s') < 0) {
                $.debug('Supplied URL could not match `%s`');
                return 'URL does not contain %s search character';

            // Also while we're here, why not set the Favicon automatically?
            } else {
                this.setFavicon(attrs.url);
            }
        }
        return false;
    },

    clear: function () {
        this.destroy();
        // If we have a view, bind to remove:
        if (this.view) {
            this.view.remove(this);
        }
    },

    toString: function () {
        return this.get('name');
    },

    // Function for Views.Dropdown
    getIconURL: function () {
        return this.get('favicon');
    },

    // Set the favicon based on the URL
    setFavicon: function (u) {
        // Get the search URL from either args or from this.url
        u = u ? u : this.get('url');
        // Run it through this.matchDomain
        u = u.match(this.matchDomain);
        // Check to see if it matches correctly
        if (u !== null && u.length === 2 && u[1]) {
            // Prepend our faviconUrl fetcher
            u = this.faviconUrl.replace('%(domain)', u[1]).toLowerCase();
            this.set({favicon: u});
        } else {
            u = false;
        }
        return u;
    }

});

Models.WebsearchCollection = $.collection.extend({

    // Bind to our model:
    model: Models.Websearch,

    current: {},

    // Define our storage method (localStorage, not REST)
    sync: $.localSync,
    localStorage: new $.localStore('websearch'),

    // These are the default engines we supply when the collection isn't found
    // in localstorage. Just a fairly general set of popular engines.
    default_Websearch_models: [
        {
            order: 1,
            name: 'Google',
            url: 'http://www.google.com/search?hl=en&q=%s+filetype:torrent' +
                '&btnG=Search'
        },
        {
            order: 2,
            name: 'MiniNova',
            url: 'http://www.mininova.org/search/?search=%s&cat=0'
        },
        {
            order: 3,
            name: 'PirateBay',
            url: 'http://thepiratebay.org/search/%s/0/99/0'
        },
        {
            order: 4,
            name: 'Torrentz',
            url: 'http://torrentz.com/search?q=%s'
        },
        {
            order: 5,
            name: 'Demonoid',
            url: 'http://www.demonoid.com/files/?query=%s'
        },
        {
            order: 6,
            name: 'btJunkie',
            url: 'http://btjunkie.org/search?q=%s'
        },
        {
            order: 7,
            name: 'LinuxTracker',
            url: 'http://linuxtracker.org/index.php?page=torrents&' +
                'search=%s&category=0&active=1&tracker=0'
        }
    ],

    // When initialised, check if localStorage is empty, if so supply some
    initialize: function () {
        $.info('Initialising Models.WebsearchCollection');

        // Fetch our potential engines from localStorage, or set the default
        if (!this.fetch() && this.length === 0) {
            this.add(this.default_Websearch_models).save();
        }

        // Bind to our own change event, with a save function
        this.bind('change', this.save, this);

        // Set the current search engine to the first:
        this.current = this.first();
    },

    // Keep the models in order of `order`
    comparator: function (model) {
        return model.get('order');
    },

    // Collections do not have a save() (its not RESTful to do so), but we're
    // using localStorage, so its ok for us to have one;
    save: function () {
        var i = 1;
        this.sort().each(function saveEachWebsearch(model) {
            model.save({order: i}, {silent: true});
            ++i;
        });
    },

    // Set the current search engine to something different
    setCurrent: function (cid) {
        this.current = this.getByCid(cid);
        this.trigger('change current', this, {current: this.current});
        return this.current;
    }

});