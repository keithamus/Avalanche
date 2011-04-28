/*globals R:false */
/*
 * i18n/en-GB.js
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
R.registerLocale('en-GB', {

    locale: 'en-GB',
    commiter: 'Keith Cirkel',
    commiter_link: 'http://code.google.com/p/avalanche-rt/',

    id_elements: {

        toolbar_search_input: {
            placeholder: 'Search the web...'
        },

        filterbar_search_input: {
            placeholder: 'Filter...'
        }

    },


    toolbar: {

        buttons: {
            open: 'Open',
            remove: 'Remove',
            resume: 'Resume',
            pause: 'Pause',
            resume_all: 'Resume All',
            pause_all: 'Pause All',
            about: 'About',
            preferences: 'Preferences',
            label: 'Label',
            hash_check: 'Hash Check'
        }

    },

    filterbar: {

        filters: {
            all: 'All (%i)',
            active: 'Active (%i)',
            downloading: 'Downloading (%i)',
            seeding: 'Seeding (%i)',
            paused: 'Paused (%i)',
            completed: 'Completed (%i)',
            new_filter: 'New Filter',
            delete_filter: 'Delete Filter'
        }

    },

    dialogue: {

        remove: {

            title: {
                one: 'Remove Torrent?',
                plural: 'Remove Torrents?'
            },

            title_removing: {
                one: 'Removing Torrent',
                plural: 'Removing Torrents'
            },

            title_success: {
                one: 'Torrent Removed',
                plural: 'Torrents Removed'
            },

            title_error: {
                one: 'Error Removing Torrent',
                plural: 'Error Removing Torrents'
            },

            close_button: 'Don\'t Remove',
            close_button_done: 'Done',
            remove_button: 'Remove Torrent',

            are_you_sure: {
                one: 'Are you sure you want to remove this torrent?',
                many: 'Are you sure you want to remove these torrents?'
            }

        },

        about: {
            title: 'About',
            version: 'version',
            license: 'Licensed under GNU GPL v3',
            testers: 'Testers: ',
            translators: 'Translators: ',
            thanks: 'Avalanche is made possible thanks to the following:',
            uptodate: 'Avalanche is up to date',
            version_check: "Checking for new version...",
            check_failed: 'Cannot check updates from server',
            upgrade: 'A new version is out! (%s)',
            donate_button: "Donate",
            update_button: "Update",
            close_button: 'Close'
        }
    },

    general: {

        months: {
            january: 'Jan',
            febuary: 'Feb',
            march: 'Mar',
            april: 'Apr',
            may: 'May',
            june: 'Jun',
            july: 'Jul',
            august: 'Aug',
            september: 'Sep',
            october: 'Oct',
            november: 'Nov',
            december: 'Dec'
        }

    },

    torrent: {

        priorities: {
            skip: 'Skip',
            low: 'Low',
            normal: 'Normal',
            high: 'High'
        }

    }
});


/*
torrents_seedinfo: "%1, uploaded %2 (Ratio %3)"
torrents_seedstat: "Seeding to %1 of %2 peers - UL: %3"
torrents_downloadinfo: "%1 of %2 (%3), uploaded %4 (Ratio %5)"
torrents_downloadstat: "Downloading from %1 peers and %2 seeders out of %3 total - DL: %4 UL: %5"
torrents_pauseinfo: "%1 of %2 (%3), uploaded %4 (Ratio %5)"
torrents_pausestat: "Paused"
torrents_completeinfo: "%1, uploaded %2 (Ratio %3)"
torrents_completestat: "Completed, Paused"
torrents_hashinginfo: "%1 of %2 checked"
torrents_hashingstat: "Checking consistency, %1 done"
statusbar_torrentsOrderedBy: "Torrents ordered by"
statusbar_speedOf: "of"
statusbar_UnlimitedSpeed: "Unlimited"
sortmenu_Name: "Name"
sortmenu_Percent: "Percent"
sortmenu_Downloaded: "Downloaded"
sortmenu_Uploaded: "Uploaded"
sortmenu_Ratio: "Ratio"
sortmenu_Peers: "Peers"
sortmenu_Seeds: "Seeds"
sortmenu_Priority: "Priority"
sortmenu_Label: "Label"
sortmenu_ETA: "ETA"
details_general: "General"
details_files: "Files"
details_peers: "Peers"
details_trackers: "Trackers"
details_no_files: "No Files"
details_no_peers: "No Peers"
details_no_trackers: "No Trackers"
details_header_name: "No Torrent Selected"
details_general_contain_title: "Torrent Information"
details_general_real_name: "Real Name"
details_general_label: "Label"
details_general_created_on: "Created On"
details_general_hash: "Hash"
details_general_tracker: "Tracker"
details_general_health: "Health"
details_general_private: "Private"
details_general_transfer: "Transfer"
details_general_time_remaining: "Time Remaining"
details_general_downloaded: "Downloaded"
details_general_uploaded: "uploaded"
details_general_down_speed: "Down Speed"
details_general_up_speed: "Up Speed"
details_general_seeds: "Seeds"
details_general_peers: "Peers"
details_general_wasted: "Wasted"
details_general_share_ratio: "Share Ratio"
details_general_disk: "Effect On Disk"
details_general_free_disk: "Free Disk"
details_general_torrentspercent: "Torrent's %"
details_general_savedin: "Saved In"
new_title: "Create New Torrent"
new_title_creating: "Creating New Torrent"
new_title_created: "Torrent Created"
new_torrentsource: "Select Source"
new_torrenttrackers: "Trackers"
new_torrentcomment: "Comment"
new_torrentstartseeding: "Start Seeding"
new_createbutton: "Create"
new_closebutton: "Cancel"
*/