(function () {
	'use strict';

	var CONFIG = {
		selector:
			'.site-header__title, .sidebar__links a, .sidebar__social a, .card__date-link, .ascii-button__text',
		chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>{}[]',
		scrambleDuration: 150,
		resolveDuration: 250,
		fps: 20,
	};

	function prefersReducedMotion() {
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	function TextScrambler(element) {
		this.element = element;
		this.textNode = this.findTextNode(element);
		this.originalText = this.textNode ? this.textNode.textContent : '';
		this.frameRequest = null;
		this.isAnimating = false;
	}

	TextScrambler.prototype.findTextNode = function (element) {
		var walker = document.createTreeWalker(
			element,
			NodeFilter.SHOW_TEXT,
			null,
			false
		);
		var lastTextNode = null;
		var node;
		while ((node = walker.nextNode())) {
			if (node.textContent.trim()) {
				lastTextNode = node;
			}
		}
		return lastTextNode;
	};

	TextScrambler.prototype.getRandomChar = function () {
		return CONFIG.chars[Math.floor(Math.random() * CONFIG.chars.length)];
	};

	TextScrambler.prototype.scramble = function () {
		if (!this.textNode || this.isAnimating || prefersReducedMotion()) return;
		this.isAnimating = true;

		var self = this;
		var startTime = performance.now();
		var totalDuration = CONFIG.scrambleDuration + CONFIG.resolveDuration;
		var frameInterval = 1000 / CONFIG.fps;
		var lastFrameTime = 0;

		function animate(currentTime) {
			if (currentTime - lastFrameTime < frameInterval) {
				self.frameRequest = requestAnimationFrame(animate);
				return;
			}
			lastFrameTime = currentTime;

			var elapsed = currentTime - startTime;
			var progress = Math.min(elapsed / totalDuration, 1);

			if (elapsed < CONFIG.scrambleDuration) {
				self.textNode.textContent = self.originalText
					.split('')
					.map(function (char) {
						return char === ' ' ? ' ' : self.getRandomChar();
					})
					.join('');
			} else {
				var resolveProgress =
					(elapsed - CONFIG.scrambleDuration) / CONFIG.resolveDuration;
				var revealCount = Math.floor(
					self.originalText.length * resolveProgress
				);

				self.textNode.textContent = self.originalText
					.split('')
					.map(function (char, i) {
						if (char === ' ') return ' ';
						if (i < revealCount) return char;
						return self.getRandomChar();
					})
					.join('');
			}

			if (progress < 1) {
				self.frameRequest = requestAnimationFrame(animate);
			} else {
				self.resolve();
			}
		}

		this.frameRequest = requestAnimationFrame(animate);
	};

	TextScrambler.prototype.resolve = function () {
		if (this.frameRequest) {
			cancelAnimationFrame(this.frameRequest);
			this.frameRequest = null;
		}
		if (this.textNode) {
			this.textNode.textContent = this.originalText;
		}
		this.isAnimating = false;
	};

	function init() {
		if (prefersReducedMotion()) return;

		var links = document.querySelectorAll(CONFIG.selector);

		links.forEach(function (link) {
			var scrambler = new TextScrambler(link);

			link.addEventListener('mouseenter', function () {
				scrambler.scramble();
			});
			link.addEventListener('mouseleave', function () {
				scrambler.resolve();
			});
			link.addEventListener('focus', function () {
				scrambler.scramble();
			});
			link.addEventListener('blur', function () {
				scrambler.resolve();
			});
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
