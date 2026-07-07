// ── SCROLL ANIMATIONS ──
function checkElementsInView() {
    const elements = document.querySelectorAll('.animate-in, .item-card');
    const triggerBottom = window.innerHeight / 5 * 4.5;

    elements.forEach((el, index) => {
        const elTop = el.getBoundingClientRect().top;
        if (elTop < triggerBottom) {
            el.classList.add('in-view');
            if (el.classList.contains('item-card')) {
                el.style.transitionDelay = `${index * 50}ms`;
            }
        }
    });
}
window.addEventListener('scroll', checkElementsInView);

window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
});

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
    const storedMenu = JSON.parse(localStorage.getItem('pgd_admin_items') || 'null');
    if(Array.isArray(storedMenu) && storedMenu.length){
      MENU = storedMenu;
    }
    const searchInput = document.getElementById('search-input');
    if(searchInput){
      searchInput.addEventListener('input', (e) => {
        curSearch = (e.target.value || '').trim();
        renderMenu();
      });
      searchInput.addEventListener('keyup', (e) => {
        curSearch = (e.target.value || '').trim();
        renderMenu();
      });
      searchInput.addEventListener('change', (e) => {
        curSearch = (e.target.value || '').trim();
        renderMenu();
      });
    }
    updateNavAuthUI();
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    if(view === 'profile' && loggedIn){
      showPage('profile');
    } else if(view === 'orders' && loggedIn){
      showPage('orders');
    } else {
      updateProfileUI();
      updateAdminUI();
      renderMenu();
      renderOrders();
      renderAdminDashboard();
      checkElementsInView();
    }
});

