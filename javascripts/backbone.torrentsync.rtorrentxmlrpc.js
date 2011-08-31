/*jslint white: true, browser: true, devel: true, onevar: true, undef: true,
 nomen: false, eqeqeq: true, plusplus: false, bitwise: true, regexp: true,
 newcap: true, immed: true, maxlen: 80, indent: 4 */
/*globals
    $: false,
    _: false,
    Backbone: false,
    window: false,
*/
/*
 * lib/backbone.torrentsync.rtorrentxmlrpc.js
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
(function () {
    var SyncEngine = function () {
        var self = this;
        return function (args) {
            return self.init.apply(self, Array.prototype.slice.call(arguments));
        };
    };
    
    SyncEngine.prototype = {
        
        
        _dataFragment: {},
        
        templates: {
            message:
                '<?xml version="1.0"?>' +
                '<methodCall>' +
                    '<methodName>{{command}}</methodName>' +
                    '<params>' +
                        '{{params}}' +
                    '</params>' +
                '</methodCall>',
                
            multicall:
                '<?xml version="1.0"?>' +
                '<methodCall>' +
                    '<methodName>system.multicall</methodName>' +
                    '<params><param><value><array><data>' +
                        '{{multicall}}' +
                    '</data></array></value></param></params>' +
                    '</methodCall>',
                    
            multicall_message:
                '<value><struct>' +
                    '<member>' +
                        '<name>methodName</name>' +
                        '<value><string>{{command}}</string></value>' +
                    '</member>' +
                    '<member><name>params</name><value><array><data>' +
                            '{{params}}' +
                    '</data></array></value></member>' +
                '</struct></value>',
                
            multicall_param:
                '<value><{{type}}>{{param}}</{{type}}></value>',
                
            param:
                '<param><value><{{type}}>{{param}}</{{type}}></value></param>'
        },
        
        init: function (methodName, model, options) {
            
            methodName = model instanceof Backbone.Collection ?
                methodName + 'Collection' :
                methodName;
                
            this.methodName = methodName;
            this.model = model;
            this.options = options;
            
            $.debug('syncEngine.' + methodName + ' being called');
            
            if (this[methodName]) {
                return this[methodName]();
            } else {
                throw new Error('syncEngine has no method ' + methodName);
            }
            return false;
        },
        
        _sendMessage: function (message, callback) {
            $.ajax({
                type: 'POST',
                dataType: 'xml',
                url: this.model.url,
                data: this._formatXMLRPCMsg(message),
                success: _.bind(function (data) {
                    $.debug('syncEngine.' + this.methodName + ' got', data);
                    
                    if ($(data).find('fault').length > 0) {
                        this.options.error($(data).find('fault string').text());
                    }
                    if (callback && !_.isArray(callback)) {
                        this._dataFragment = $(data).find('value:eq(0)>array');
                        callback.call(this, this._dataFragment);
                    } else if (callback) {
                        _.each(callback, function (fn, i) {
                            if (fn) {
                                this._dataFragment =
                                    $(data).find('value:eq(0)>array' +
                                                 '>data>value:eq' + i +
                                                 '>array');
                                fn.call(this, this._dataFragment);
                            }
                        }, this);
                    }
                    
                    this.options.success(this.successJSON);
                }, this)
            });
        },
        
        _formatXMLRPCMsg: function (messages) {
            var ret = '', multi = messages.length > 1,
                message_tmpl = multi ?
                    this.templates.multicall_message :
                    this.templates.message,
                params_tmpl = multi ?
                    this.templates.multicall_param :
                    this.templates.param;
            
            _.each(messages, function (message) {
                ret += $.tmpl(message_tmpl, {
                    command: message[0],
                    params: this._formatXMLRPCParams(message[1], params_tmpl)
                });
            }, this);
            
            return multi ?
                $.tmpl(this.templates.multicall, {multicall: ret}) : ret;
        },
        
        _formatXMLRPCParams: function (params, template) {
            var ret = '';
            
            _.each(params, function (value) {
                var type = typeof value === "number" ? 'i8' : 'string';
                ret += $.tmpl(template, { param: value, type: type });
            }, this);
            
            return ret;
        },
        
        _getNode: function (n, nodename) {
            n = n || 0;
            nodename = nodename || 'value';
            return this._dataFragment.find(nodename).eq(n).text();
        },
        
        _getNodeBool: function (n, nodename) {
            return this._getNode(n, nodename) === '1';
        },
        
        _getNodeInt: function (n, nodename) {
            return parseInt(this._getNode(n, nodename), 10);
        },
        
        read: function () {
            
        },
        
        _readCollectionParams: [
            'name', //Make an array for all loaded torrents
            'd.get_hash=',                //[0]  The torrent hash
            'd.get_name=',                //[1]  Torrent's name
            
            'd.get_state=',               //[2]  0 = stopped, 1 = started
            'd.get_complete=',            //[3]  1 = finished
            'd.is_hash_checking=',        //[4]  1 = hashing
            
            'd.get_priority=',            //[5]  Torrent priority
            'd.get_chunk_size=',          //[6]  Size of a chunk in bytes
            'd.get_size_chunks=',         //[7]  How many chunks in torrent
            'd.get_completed_chunks=',    //[8]  Downloaded chunks
            
            'd.get_down_total=',          //[8]  Total bytes downloaded
            'd.get_up_total=',            //[9]  Total bytes uploaded
            'd.get_down_rate=',           //[10] Download rate in bytes
            'd.get_up_rate=',             //[11] Upload rate in bytes
            
            'd.get_peers_complete=',      //[12] Seeders
            'd.get_peers_accounted=',     //[13] Leechers
            'd.get_peers_connected=',     //[14] Connected Peers
            'd.get_peers_not_connected=', //[15] Not Connected Peers
            
            'd.get_skip_total=',          //[16] How many wasted bytes?
            'd.get_creation_date=',       //[17] Date torrent added (EPOCH)
            'd.get_base_path=',           //[18] Torrents Path
            
            'd.is_private=',              //[19] Is torrent private?
            'd.get_custom5='              //[20] Extra torrent meta JSON
        ],
        
        readCollection: function () {
            this._sendMessage([
                ['d.multicall', this._readCollectionParams]
            ], this.parseReadCollection);
        },
        
        parseReadCollection: function (values) {
            var ret = [];
            _.each(values.find('data>value>array>data'), function (torrent) {
                this._dataFragment = $(torrent);
                
                var customValues = JSON.parse(this._getNode(20)) || {},
                    active = this._getNodeBool(2),
                    complete = this._getNodeBool(3),
                    numChunks = this._getNodeBool(7);
                
                ret.push({
                    hash: this._getNode(0),
                    name: this._getNode(1),
                    alias: customValues.alias || '',
                    labels: customValues.labels || [],
                    
                    state: this._getNodeBool(4) ?
                                'hashing' :
                                (complete ?
                                    (active ? 'seeding' : 'complete') :
                                    (active ? 'downloading' : 'paused')),
                    active: active,
                    complete: complete,
                    
                    priority: this._getNode(5),
                    size: this._getNodeInt(6) * numChunks,
                    progress: Math.floor(
                                (this._getNodeInt(8) / numChunks) * 100),
                    
                    downloaded: this._getNodeInt(8),
                    uploaded: this._getNodeInt(9),
                    downspeed: this._getNodeInt(10),
                    upspeed: this._getNodeInt(11),
                    
                    seeds: this._getNodeInt(12),
                    leechers: this._getNodeInt(13),
                    totalpeersconnected: this._getNodeInt(14),
                    totalpeers: this._getNodeInt(14) + this._getNodeInt(15),
                    
                    wasted: this._getNodeInt(16),
                    dateadded: this._getNodeInt(17),
                    savedin: this._getNode(18),
                    
                    lastupdated: Number(new Date()),
                    
                    'private': this._getNodeBool(19)
                });
            }, this);
            
            return (this.successJSON = ret);
        },
        
        pauseCollection: function () {
            this._sendMessage([
                [ 'd.multicall', ['started', 'd.stop='] ],
                [ 'd.multicall', ['stopped', 'd.close='] ],
                [ 'd.multicall', this._readCollectionParams ]
            ], [false, false, this.parseReadCollection]);
        },
        
        resumeCollection: function () {
            this._sendMessage([
                [ 'd.multicall', ['closed', 'd.open='] ],
                [ 'd.multicall', ['stopped', 'd.start='] ],
                [ 'd.multicall', this._readCollectionParams ]
            ], [false, false, this.parseReadCollection]);
        }
        
    };
    
    Backbone.torrentSyncRtorrentXMLRPC = new SyncEngine();
}(window));