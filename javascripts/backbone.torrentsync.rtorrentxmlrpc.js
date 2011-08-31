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
        
        readCollection: function () {
            this._sendMessage('d.multicall', [
                'name', //Make an array for all loaded torrents
                'd.get_hash=',  //The torrent hash
                'd.get_name=', //Torrent's name
                'd.get_state=',  //0 = stopped, 1 = started
                'd.get_up_total=',  //How much in total has been uploaded
                'd.get_down_rate=',  //Download rate in bytes
                'd.get_up_rate=',  //Upload rate in bytes
                'd.get_peers_connected=',  //Amount of connected peers
                'd.get_peers_not_connected=',  //Amount of unconnected peers
                'd.get_peers_accounted=',  //Number of leechers
                'd.get_complete=',  //Is the torrent completely downloaded?
                'd.is_hash_checking=',  //Is it rehashing?
                'd.get_creation_date=',  //Date torrent added
                'd.get_base_path=',  //Where the torrent exists
                'd.get_free_diskspace=',  //Free disk space where torrent is
                'd.is_private=',  //Is torrent private?
                'd.get_message=',  //Comment
                'd.get_priority=',  //Priority (number)
                'd.is_hash_checked=',  //Has it been hash checked before?
                'd.get_skip_total=',  //How many wasted bytes?
                'd.get_custom5=',  //Extra torrent meta JSON
                //http://libtorrent.rakshasa.no/ticket/1538
                //dont use get_size_bytes, multiply chunk_size by size_chunks
                'd.get_chunk_size=',  //Get the size of a single chunk in bytes
                'd.get_size_chunks=',  //Get how many chunks are in the torrent
                'd.get_completed_chunks=' //Get how many chunks have downloaded.
            ]);
        }
        
    };
    
    Backbone.torrentSyncRtorrentXMLRPC = new SyncEngine();
}(window));