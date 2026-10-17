const navLinkEls = document.querySelectorAll( '.nav-link' );
const sectionEls = document.querySelectorAll( '.section' );

let currentSection = 'hero';
window.addEventListener( 'scroll', () => {
    sectionEls.forEach( sectionEl => {
        if ( window.scrollY >= ( sectionEl.offsetTop - sectionEl.clientHeight / 3 )) {
            currentSection = sectionEl.id;
        }
    });
console.log(`Currently in Section: ${currentSection}`);
    navLinkEls.forEach( navLinkEl => {
        if ( navLinkEl.href.includes( currentSection )) {
            document.querySelector( '.active' ).classList.remove( 'active' );
            navLinkEl.classList.add( 'active' );
        }
    });
});
