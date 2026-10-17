const navLinkEls = document.querySelectorAll( '.nav-link' );

navLinkEls.forEach( navLinkEl => {
    navLinkEl.addEventListener( 'click', () => {
        document.querySelector( '.active' )?.classList.remove( 'active' );
        navLinkEl.classList.add( 'active' );
    });
});

      // Collapse Navbar on Mobile After Link Click
      document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
          const navbarCollapse = document.getElementById('navbarNav');
          const isExpanded = window.getComputedStyle(navbarCollapse).display !== 'none';
          if (isExpanded) {
            const navbarToggler = document.querySelector('.navbar-toggler');
            navbarToggler.click();
          }
        });
      });   