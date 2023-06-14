const ImageZoom = () => {
	const containers = document.querySelectorAll('.image-container');

	// Zoom elements
	const minZoom = 0.2;
	const maxZoom = 1;
	let defZoomLevel = 0.5;
	const zoomedScale = .8;

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

		});

		containerImg.addEventListener('mouseleave', () => {
			container.classList.remove('mouse-over')

			containerImg.removeEventListener('mousemove', getSetLensPos)
			containerImg.removeEventListener('mousewheel', zoomImage)
		});

		containerImg.addEventListener('click', initFullScreenSlider);

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
			imgRect = containerImg.getBoundingClientRect();
			let mouseX = e.pageX - imgRect.left;
			let mouseY = e.pageY - imgRect.top;

			// Consider any page scrolling:
			mouseX = mouseX - window.scrollX;
			mouseY = mouseY - window.scrollY;

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
			sliderInteractions()
		}

		function createFullScreenSlider(e) {
			//Add slider container
			const fullScreenContainer = document.createElement('div');
			fullScreenContainer.classList.add('fullscreen-container');
			const fullScreenBg = document.createElement('div');
			fullScreenBg.classList.add('fullscreen-bg');
			const fullScreenSlider = document.createElement('div');
			fullScreenSlider.classList.add('fullScreen-slider');
			const sliderWrapper = document.createElement('div');
			sliderWrapper.classList.add('slider-wrapper');

			//Add slider arrows
			const [sliderArrowsContainer, arrowRight, arrowLeft, arrowWrapperRight, arrowWrapperLeft] = createArrows();

			//Add slider container to page
			document.body.appendChild(fullScreenContainer);
			fullScreenContainer.appendChild(fullScreenBg);
			fullScreenContainer.appendChild(fullScreenSlider);
			fullScreenSlider.appendChild(sliderWrapper);
			fullScreenSlider.appendChild(sliderArrowsContainer);
			sliderArrowsContainer.appendChild(arrowWrapperRight);
			sliderArrowsContainer.appendChild(arrowWrapperLeft);
			arrowWrapperRight.appendChild(arrowRight);
			arrowWrapperLeft.appendChild(arrowLeft);
			arrowRight.appendChild(arrowSvg(arrowWrapperRight));
			arrowLeft.appendChild(arrowSvg(arrowWrapperLeft));

			imgSlider([...containers], sliderWrapper);
		}

		function createArrows() {
			const sliderArrowsContainer = document.createElement('div');
			sliderArrowsContainer.classList.add('slider-arrows');

			const arrowWrapperRight = document.createElement('div');
			arrowWrapperRight.classList.add('arrow-цrapper');
			arrowWrapperRight.classList.add('arrow-right');

			const arrowWrapperLeft = document.createElement('div');
			arrowWrapperLeft.classList.add('arrow-цrapper');
			arrowWrapperLeft.classList.add('arrow-left');

			const arrowRight = document.createElement('div');
			const arrowLeft = document.createElement('div');

			return [sliderArrowsContainer, arrowRight, arrowLeft, arrowWrapperRight, arrowWrapperLeft];
		}

		function arrowSvg(arrow) {
			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			const iconPath = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'path'
			);
			svg.setAttribute('viewBox', '0 0 24 24');
			iconPath.setAttribute('fill', 'rgb(200, 200, 200)');

			arrow.classList.contains('arrow-right')
				? iconPath.setAttribute(
					'd',
					'M15.4 12.97l-2.68 2.72 1.34 1.38L19 12l-4.94-5.07-1.34 1.38 2.68 2.72H5v1.94z'
				)
				: iconPath.setAttribute(
					'd',
					'M11.28 15.7l-1.34 1.37L5 12l4.94-5.07 1.34 1.38-2.68 2.72H19v1.94H8.6z'
				)

			svg.appendChild(iconPath);
			return svg;
		}

		function imgSlider(containers, sliderWrapper) {
			containers.forEach((container, i) => {
				const slide = document.createElement('div');
				slide.classList.add('slider-slide');
				const slideImg = document.createElement('img');
				slideImg.classList.add('slide-img');

				const parentImg = container.querySelector('img');

				slide.setAttribute('aria-order', i);
				slideImg.src = `${parentImg.src}`;

				sliderWrapper.appendChild(slide);
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

		function sliderInteractions() {
			const slider = document.querySelector('.fullScreen-slider');
			const sliderWrapper = slider.querySelector('.slider-wrapper');
			const sliderSlides = slider.querySelectorAll('.slider-slide');
			const sliderArrows = slider.querySelectorAll('.slider-arrows div');
			const computed = getComputedStyle(sliderSlides[0])
			const compWidth = Number(computed.width.slice(0, -2))
			const compMarginRight = Number(computed.marginRight.slice(0, -2))
			let currentIndex = 0;

			slider.addEventListener('mousewheel', function (e) {
				e.preventDefault();
				console.log(compWidth, compMarginRight);
				(e.deltaY < 0) ? previousSlide() : nextSlide()
			});

			sliderArrows.forEach(arr => {
				arr.addEventListener('click', (e) => {
					e.stopPropagation();
					if (e.target.classList.contains('arrow-right')) {
						nextSlide()
					}
					if (e.target.classList.contains('arrow-left')) {
						previousSlide()
					}
				})
			})


			const showSlide = (index) => sliderWrapper.style.transform = `translateX(-${index * (compWidth + compMarginRight)}px)`

			function nextSlide() {
				currentIndex++;
				if (currentIndex >= sliderSlides.length) currentIndex = 0;
				showSlide(currentIndex);
			}

			function previousSlide() {
				currentIndex--;
				if (currentIndex < 0) currentIndex = sliderSlides.length - 1;
				showSlide(currentIndex);
			}
		}
	});
};


// const testing = () => {
// 	const testContainer = document.querySelector('.test-urls');

// 	testContainer.querySelector('button').addEventListener('click', () => {
// 		const inputValue = testContainer.querySelector('input').value;
// 		const contentWrapper = document.querySelector('.content-wrapper');

// 		const imgContainer = document.createElement('div');
// 		imgContainer.classList.add('image-container');

// 		const zoomedImg = document.createElement('img');
// 		zoomedImg.classList.add('zoom-image');
// 		zoomedImg.setAttribute('src', inputValue);
// 		zoomedImg.setAttribute('alt', 'img');

// 		contentWrapper.appendChild(imgContainer);
// 		imgContainer.appendChild(zoomedImg);

// 		ImageZoom();
// 	})
// }



//Init functions
window.addEventListener('load', () => {
	ImageZoom();
	// testing()
});