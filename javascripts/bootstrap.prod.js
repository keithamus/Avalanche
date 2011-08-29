/*jslint white: true, browser: true, devel: true, onevar: true, undef: true,
 nomen: false, eqeqeq: true, plusplus: false, bitwise: true, regexp: true,
 newcap: true, immed: true, maxlen: 80, indent: 4 */
/*globals
    window: false,
    Backbone: false,
    Controllers: false,
    $: false,
*/
$.log   = function () {};
$.warn  = function () {};
$.error = function () {};
$.info  = function () {};
$.debug = function () {};

$(document).ready(function InistialiseAvalanche() {
    var avalanche = new Controllers.Application();
    Backbone.history.start();
});