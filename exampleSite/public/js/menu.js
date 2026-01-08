(function () {
	var hamburger = document.getElementById('hamburger');
	var sidebar = document.getElementById('sidebar');
	if (hamburger && sidebar) {
		hamburger.addEventListener('click', function () {
			var isOpen = sidebar.classList.toggle('is-open');
			hamburger.setAttribute('aria-expanded', isOpen);
		});
		document.addEventListener('click', function (e) {
			if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
				sidebar.classList.remove('is-open');
				hamburger.setAttribute('aria-expanded', 'false');
			}
		});
	}
})();
