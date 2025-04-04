document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const section = e.target.dataset.section;

        document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));

        if (section === 'login') {
            renderLogin();
        } else if (section === 'register') {
            renderRegister();
        }

        const home = document.getElementById('home');
        if (section === 'home') home.classList.add('active');
    });
});
