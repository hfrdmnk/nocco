(function () {
	var hamburger = document.getElementById('hamburger');
	var sidebar = document.getElementById('sidebar');

	if (hamburger && sidebar) {
		function openMenu() {
			hamburger.classList.add('is-open');
			sidebar.classList.add('is-open');
			hamburger.setAttribute('aria-expanded', 'true');
			document.body.style.overflow = 'hidden';
		}

		function closeMenu() {
			hamburger.classList.remove('is-open');
			sidebar.classList.remove('is-open');
			hamburger.setAttribute('aria-expanded', 'false');
			document.body.style.overflow = '';
		}

		hamburger.addEventListener('click', function () {
			if (sidebar.classList.contains('is-open')) {
				closeMenu();
			} else {
				openMenu();
			}
		});

		// Close menu when clicking on the backdrop (sidebar itself, not its content)
		sidebar.addEventListener('click', function (e) {
			if (e.target === sidebar) {
				closeMenu();
			}
		});

		// Close menu on Escape key
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
				closeMenu();
			}
		});

		// Close menu when window is resized to desktop
		window.addEventListener('resize', function () {
			if (window.innerWidth > 768 && sidebar.classList.contains('is-open')) {
				closeMenu();
			}
		});
	}
})();
