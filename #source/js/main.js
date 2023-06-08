const ImageZoom = () => {
	const containers = document.querySelectorAll('.image-container');

	// Zoom elements
	const minZoom = 0.2;
	const maxZoom = 1;
	let defZoomLevel = 0.5;
	const zoomedScale = 0.5;

	[...containers].forEach(container => {
		const containerImg = container.querySelector('img');
		let imgRect = containerImg.getBoundingClientRect();
		const defWidth = containerImg.offsetWidth;
		const defHeight = containerImg.offsetHeight;
		let zoomLevel = defZoomLevel;

		const [zoomedImg, zoomLens] = createActionElements();
		setActionElementsSize();

		containerImg.addEventListener('mouseenter', () => {
			container.classList.add('mouse-over');

			containerImg.addEventListener('mousemove', getSetLensPos)
			containerImg.addEventListener('mousewheel', zoomImage)
			containerImg.addEventListener('click', initFullScreenSlider)
		});

		containerImg.addEventListener('mouseleave', () => {
			container.classList.remove('mouse-over')

			containerImg.removeEventListener('mousemove', getSetLensPos)
			containerImg.removeEventListener('mousewheel', zoomImage)
		});

		function createActionElements() {
			const zoomedImg = document.createElement('div');
			zoomedImg.classList.add('zoomed-img');
			const zoomLens = document.createElement('div');
			zoomLens.classList.add('zoom-lens');

			return [zoomedImg, zoomLens];
		}

		function setActionElementsSize() {
			zoomLens.style.width = `${defWidth * zoomLevel}px`;
			zoomLens.style.height = `${defHeight * zoomLevel}px`;

			zoomedImg.style.width = `${imgRect.width * zoomedScale}px`;
			zoomedImg.style.height = `${imgRect.height * zoomedScale}px`;
			zoomedImg.style.background = `
			${containerImg.width / zoomLevel}px 
			${containerImg.height / zoomLevel}px
			url(${containerImg.src}) 
			rgba(255, 255, 255)
			no-repeat
		`;

			container.appendChild(zoomedImg);
			container.appendChild(zoomLens);
		}

		function zoomImage(e) {
			e.preventDefault();
			const wheelDelta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
			zoomLevel += wheelDelta * 0.05;
			zoomLevel = Math.max(minZoom, Math.min(maxZoom, zoomLevel));

			zoomLens.style.width = `${defWidth * zoomLevel}px`;
			zoomLens.style.height = `${defHeight * zoomLevel}px`;

			getSetLensPos(e, zoomLevel);
		}

		function getSetLensPos(e) {
			e = e || window.event;
			imgRect = containerImg.getBoundingClientRect();
			let mouseX = e.pageX - imgRect.left;
			let mouseY = e.pageY - imgRect.top;
			/* Consider any page scrolling: */
			mouseX = mouseX - window.pageXOffset;
			mouseY = mouseY - window.pageYOffset;

			const zoomLensX = mouseX - zoomLens.offsetWidth / 2;
			const zoomLensY = mouseY - zoomLens.offsetHeight / 2;

			const maxZoomX = containerImg.offsetWidth - zoomLens.offsetWidth;
			const maxZoomY = containerImg.offsetHeight - zoomLens.offsetHeight;

			const defX = Math.min(Math.max(zoomLensX, 0), maxZoomX);
			const defY = Math.min(Math.max(zoomLensY, 0), maxZoomY);

			const X = defX + (container.offsetWidth - containerImg.offsetWidth) / 2;
			const Y = defY + (container.offsetHeight - containerImg.offsetHeight) / 2;

			zoomLens.style.left = `${X}px`;
			zoomLens.style.top = `${Y}px`;

			zoomedImgSize(defX, defY, zoomLevel);
		}

		function zoomedImgSize(defX, defY) {
			const zoomFactorX = zoomedImg.offsetWidth / containerImg.offsetWidth;
			const zoomFactorY = zoomedImg.offsetHeight / containerImg.offsetHeight;

			zoomedImg.style.backgroundPosition = `
			-${defX / zoomLevel * zoomedScale}px 
			-${defY / zoomLevel * zoomedScale}px
		`;
			zoomedImg.style.backgroundSize = `
			${containerImg.offsetWidth * zoomFactorX / zoomLevel}px 
			${containerImg.offsetHeight * zoomFactorY / zoomLevel}px
		`;
		}

		function initFullScreenSlider(e) {
			createFullScreenSlider(e);

			document.body.classList.add('fixed');

			closeSlider();
		}

		// fullScreenImg
		function createFullScreenSlider(e) {
			//Add slider container
			const fullScreenContainer = document.createElement('div');
			fullScreenContainer.classList.add('fullscreen-container');
			const fullScreenBg = document.createElement('div');
			fullScreenBg.classList.add('fullscreen-bg');
			const fullScreenSlider = document.createElement('div');
			fullScreenSlider.classList.add('fullScreen-slider');

			//Add slider container to page
			document.body.appendChild(fullScreenContainer);
			fullScreenContainer.appendChild(fullScreenBg);
			fullScreenContainer.appendChild(fullScreenSlider);

			imgSlider([...containers], fullScreenSlider);
		}

		function imgSlider(containers, fullScreenSlider) {
			containers.forEach((container, i) => {
				const slide = document.createElement('div');
				slide.classList.add('slider-slide');
				const slideImg = document.createElement('img');
				slideImg.classList.add('slide-img');

				const parentImg = container.querySelector('img');

				slide.setAttribute('aria-order', i);
				slideImg.src = `${parentImg.src}`;

				fullScreenSlider.appendChild(slide);
				slide.appendChild(slideImg);
			});
		}

		function closeSlider() {
			const fullScreenSlider = document.querySelector('.fullscreen-container');

			fullScreenSlider.addEventListener('click', function (e) {
				if (!e.target.closest('.fullScreen-slider')) {
					fullScreenSlider.remove()
					document.body.classList.remove('fixed');
				}
			});
		}
	});
};



//Init functions
window.addEventListener('load', (e) => {
	ImageZoom();
});