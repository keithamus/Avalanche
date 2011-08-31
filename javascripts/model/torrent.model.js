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
 * model/torrent.js
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

Models.Torrent = $.model.extend({

    url: '/RPC',
    sync: $.torrentSync.RtorrentXMLRPC,
    idAttribute: 'hash',

    defaults: {
        id: '',
        name: '',
        alias: '',
        labels: [],
        state: 'paused',
        active: false,
        complete: false,
        priority: 0,
        size: 0,
        progress: 0,
        downloaded: 0,
        uploaded: 0,
        downspeed: 0,
        upspeed: 0,
        seeds: 0,
        leechers: 0,
        totalpeersconnected: 0,
        totalpeers: 0,
        wasted: 0,
        dateadded: 0,
        savedin: '',
        lastupdated: 0,
        'private': false
    },
    
    initialize: function () {
        this.cid = this.id || this.cid;
        
        // Take a snapshot of attributes now and on every save action
        var updateOldAttributes = _.bind(function () {
            this._oldAttributes = _.clone(this.attributes);
        }, this);
        updateOldAttributes();
        this.bind('saved', updateOldAttributes);
    },
    
    pause: function (options) {
        return this.set({active: false}).save();
    },
    
    resume: function (options) {
        return this.set({active: true}).save();
    }

});

Models.TorrentCollection = $.collection.extend({
    
    url: '/RPC',
    sync: $.torrentSync.RtorrentXMLRPC,
    
    model: Models.Torrent,
    
    initialize: function () {
        $.info('Initialising Models.TorrentCollection');
        this.fetch();
    },
    
    updateModels: function (models) {
        _.each(models, function (modelData) {
            var model = this.get(modelData.hash);
            
            if (model) {
                model.set(modelData);
            } else {
                this.add(modelData);
            }
        }, this);
    },
    
    _collectionSyncHelper: function (syncCommand, success, options) {
        options = options || {};
        
        var optsuccess = options.success, successFunc;
        
        if (typeof success === 'string') {
            successFunc = function (resp, status, xhr) {
                this[success](this.parse(resp, xhr));
            };
        } else {
            successFunc = success;
        }
        
        options.success = _.bind(function (resp, status, xhr) {
            successFunc.call(this, resp, status, xhr);
            if (optsuccess) {
                optsuccess(this, resp);
            }
        }, this);
        
        if (!options.error) {
            options.error = _.bind(function (resp) {
                this.trigger('error', this, resp, options);
            }, this);
        }
        
        return this.sync.call(this, syncCommand, this, options);
    },
    
    // Like fetch, but only updates existing records
    update: function (options) {
        return this._collectionSyncHelper('read', 'updateModels', options);
    },
    
    pause: function (options) {
        return this._collectionSyncHelper('pause', 'updateModels', options);
    },
    
    resume: function (options) {
        return this._collectionSyncHelper('resume', 'updateModels', options);
    }
    
});