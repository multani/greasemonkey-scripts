// ==UserScript==
// @name           Netbook Roundcube
// @namespace      http://multani.info/projects/greasemonkey
// @description    Smaller Roundcube interface to fit on a netbook
// @include        https://webmail.webfaction.com/*
// ==/UserScript==


function purgeGUI() {
    // Remove useless stuff in the GUI and make it lighter to fit on the
    // netbook.

    // First, remove the logo
    var header = document.getElementById('header');
    if (header) {
        header.parentNode.removeChild(header);
    }

    // Move the toolbar for messages manipulation upper
    var toolbar = document.getElementById('messagetoolbar');
    if (toolbar) {
        toolbar.style.left = '20px';
        toolbar.style.top = 0;
        toolbar.style.right = 0;
    }

    // Also move the main frame upper
    var mainscreen = document.getElementById('mainscreen');
    if (mainscreen) {
        mainscreen.style.top = '45px';
    }

    // Make the global taskbar lighter...
    var taskbar = document.getElementById('taskbar');
    if (taskbar) {
        // First, remove the text of the links, the images are sufficient.
        var links = taskbar.getElementsByTagName('a');
        for(var i = 0; i < links.length; i++ ) {
            var link = links[i];
            link.innerHTML = '';
        }

        // Then, make this specific toolbar part of the message toolbar, with a
        // small separation between.
        // Be sure to include the whole toolbar name #taskbar, because it has
        // many styles associated to it, for example the icons of the buttons.
        toolbar.appendChild(taskbar.parentNode.removeChild(taskbar));
        taskbar.style.cssFloat = 'left';
        taskbar.style.width = 'auto';
        taskbar.style.position = 'relative';
        taskbar.style.backgroundImage = 'none';
        taskbar.style.textAlign = 'left';
        taskbar.style.paddingLeft = '10px'
    }

    // Make the search bar smaller and move it upper to fit with the rest of
    // the modifications
    var search = document.getElementById('quicksearchbar');
    if (search) {
        search.style.top = "10px";
        var l = search.getElementsByTagName('label');
        if (l.length > 0) {
            var label = l[0];
            label.parentNode.removeChild(label);
        }
    }
}

// Allow to toggle the visibility of the folders pane by clicking on the
// separation bar.
// TODO: we can also handle:
// * Keep the last toggle state
// * Allow to resize without toggling. Currently, we can resize the folder
//   pane, but as soon as we hold off the mouse button, the folder frame is
//   toggled.
// * Don't resize the separation bar if the folder pane is toggled.
function toggleFolders(toggler) {
    var folders = document.getElementById("mailleftcontainer");
    var other = folders.parentNode.children[1];

    // We store the position of the separation bar in the 'old-left' attribute.
    // TODO: I think RoundCube already save this somewhere, maybe I should have
    // a look.
    if (folders.style.display == "none") {
        toggler.style.left = toggler.getAttribute("old-left");
        other.style.left = other.getAttribute("old-left");
        folders.style.display = "block";
    }
    else
    {
        toggler.setAttribute("old-left", toggler.style.left);
        toggler.style.left = 0;
        other.setAttribute("old-left", other.style.left);
        other.style.left = "10px";
        folders.style.display = "none";
    }
}

// Register the toggler event if the separation bar is in the page.
// As far as I tested it, this function is called twice, and the first time, it
// can't found the separation bar element.
function registerToggleFolderEvent() {
    // This element might not be necessary present.
    var folderToggler = document.getElementsByClassName("splitter");
    if (folderToggler.length > 0) {
        console.log("Toggler detected");
        var toggler = folderToggler[0];
        toggler.addEventListener("click",
                function() { toggleFolders(toggler); },
                true);
    }
}

purgeGUI();
// We have to call the registerToggleFolderEvent() function after the content
// of the window as been built, because the separation bar, on which we add the
// toggle event handler is created by a Javascrit function which is triggered
// when the document has been loaded.
window.addEventListener('load', registerToggleFolderEvent, false);
