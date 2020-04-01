'use strict';

// configure the sticky sidebar
if (window.innerWidth > 1023) {
    var sidebar = new StickySidebar('#sidebar-nav', {
        innerWrapperSelector: '.sidebar__inner',
        topSpacing: 20,
    });
}

// code to highlight the selected page
var urlParts = document.URL.split('/')
var urlFile = urlParts[urlParts.length - 1]
var links = document.getElementsByTagName('a')
for (var i = 0; i < links.length; i++) {
    var el = links[i]
    var linkParts = el.href.split('/')
    var linkFile = linkParts[linkParts.length - 1]

    if (urlFile === linkFile) {
        el.className = 'active'
    }
}

// configure the mobile navbar menu
$('#hamburger').on('click', function (e) {
    // make the hamburger active
    $('#hamburger').toggleClass('is-active')

    let urlParts = document.URL.split('/')
    let path = urlParts[urlParts.length - 1]

    // if on the homepage, show the regular menu
    if (path === 'index.html' || path === '/' || path === '') {
        $('.navbar-menu').toggleClass('active')

    // on all other pages, render the right sidebar
    } else {
        // show the right mobile sidebar
        $('#sidebar-nav').toggleClass('sticky')
        $('#stickyNavbarOverlay').toggleClass('active')

        // bind a listener to close the right sidebar
        $('#stickyNavbarOverlay').one('click', function() {
            $('#hamburger').toggleClass('is-active')
            $('#sidebar-nav').toggleClass('sticky')
            $('#stickyNavbarOverlay').toggleClass('active')
        })
    }
})
