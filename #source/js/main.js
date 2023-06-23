const ImageZoom = () => {
	const containers = document.querySelectorAll('.zoom-container');

	// Zoom elements
	const minZoom = 0.2;
	const maxZoom = 1;
	let defZoomLevel = 0.5;
	const zoomedScale = 1;
	let flag = false;

	const zoomedImgContainer = document.createElement('div');

	[...containers].forEach(container => {
		const containerImg = container.querySelector('img');
		let imgRect = containerImg.getBoundingClientRect();
		const defWidth = containerImg.offsetWidth;
		const defHeight = containerImg.offsetHeight;
		let zoomLevel = defZoomLevel;

		const ratioX = Number(checkRatioX(imgRect));
		const ratioY = Number(checkRatioY(imgRect));

		const [zoomedImg, zoomLens] = createActionElements();

		setZoomLensSize();
		setZoomedImgSize();
		zoomedImgContainerPosSize();

		containerImg.addEventListener('mouseenter', () => {
			zoomedImgContainer.classList.add('mouse-over');
			container.classList.add('mouse-over');
			zoomedImg.style.display = 'block';

			containerImg.addEventListener('mousemove', getSetLensPos);
			containerImg.addEventListener('wheel', zoomImage);

			containerImg.addEventListener('click', removeSlider);
		});

		containerImg.addEventListener('mouseleave', removeSlider);

		function createActionElements() {
			const zoomedImg = document.createElement('div');
			zoomedImg.classList.add('zoomed-img');
			const zoomLens = document.createElement('div');
			zoomLens.classList.add('zoom-lens');

			return [zoomedImg, zoomLens];
		}

		function setZoomLensSize() {
			zoomLens.style.width = `${defWidth * zoomLevel}px`;
			zoomLens.style.height = `${defHeight * zoomLevel}px`;
			container.appendChild(zoomLens);
		}

		function setZoomedImgSize() {
			zoomedImg.style.width = `${imgRect.width * zoomedScale * ratioX}px`;
			zoomedImg.style.height = `${imgRect.height * zoomedScale * ratioY}px`;
			zoomedImg.style.background = `
				${containerImg.width / zoomLevel}px 
				${containerImg.height / zoomLevel}px
				url(${containerImg.src}) 
				rgba(255, 255, 255)
				no-repeat
			`;
			zoomedImgContainer.appendChild(zoomedImg);
		}

		function zoomedImgContainerPosSize() {
			if (flag == true) return

			zoomedImgContainer.classList.add('zoomed-container');
			document.querySelector('body').appendChild(zoomedImgContainer);
			let containerRect = document.querySelector('.zoom-wrapper').getBoundingClientRect();
			/*			let imgWidths = []
						let imgHeights = [];
			
						[...containers].forEach(el => {
							const imgRect = el.querySelector('img').getBoundingClientRect();
							imgWidths.push(imgRect.width);
							imgHeights.push(imgRect.height);
						});
			
						zoomedImgContainer.style.width = `${Math.max(...imgWidths)}px`;
						zoomedImgContainer.style.height = `${Math.max(...imgHeights)}px`;*/

			zoomedImgContainer.style.width = `${containerRect.width}px`;
			zoomedImgContainer.style.height = `${containerRect.height}px`;

			zoomedImgContainer.style.top = `${containerRect.top + 2}px`;
			zoomedImgContainer.style.left = `${containerRect.right + 5}px`;

			window.addEventListener('resize', () => {
				let containerRect = document.querySelector('.zoom-wrapper').getBoundingClientRect();
				zoomedImgContainer.style.top = `${containerRect.top + 2}px`;
				zoomedImgContainer.style.left = `${containerRect.right + 5}px`;
			})
			flag = true;
		}

		function zoomImage(e) {
			e.preventDefault();
			const wheelDelta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
			zoomLevel -= wheelDelta * 0.05;
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
				-${defX / zoomLevel * zoomedScale * ratioX}px 
				-${defY / zoomLevel * zoomedScale * ratioY}px
			`;
			zoomedImg.style.backgroundSize = `
				${containerImg.offsetWidth * zoomFactorX / zoomLevel}px 
				${containerImg.offsetHeight * zoomFactorY / zoomLevel}px
			`;
		}

		function checkRatioX(imgRect) {
			return imgRect.height / 4 > imgRect.width ? 1.5 : 1
		}

		function checkRatioY(imgRect) {
			return imgRect.width / 4 > imgRect.height ? 1.5 : 1
		}

		function removeSlider() {
			zoomedImgContainer.classList.remove('mouse-over');
			container.classList.remove('mouse-over');
			zoomedImg.style.display = 'none';

			containerImg.removeEventListener('mousemove', getSetLensPos);
			containerImg.removeEventListener('wheel', zoomImage);
		}
	});
};

const fullScreenSlider = () => {
	const containers = document.querySelectorAll('.zoom-container');

	createFullScreenSlider();

	[...containers].forEach(container => {
		container.addEventListener('click', () => {
			document.body.classList.add('fixed');
			document.querySelector('.fullscreen-container').classList.add('visible');

			imgSlider([...containers]);
			sliderInteractions();
		})

		function imgSlider(containers) {
			const sliderWrapper = document.querySelector('.fullScreen-slider .slider-wrapper');

			containers.forEach(container => {
				const slide = document.createElement('div');
				slide.classList.add('slider-slide');
				const slideImg = document.createElement('img');
				slideImg.classList.add('slide-img');

				const parentImg = container.querySelector('.zoom-image');

				slideImg.src = `${parentImg.src}`;

				sliderWrapper.appendChild(slide);
				slide.appendChild(slideImg);
			});

		}

		function closeSlider() {
			document.body.classList.remove('fixed');
			document.querySelector('.fullscreen-container').classList.remove('visible');
			document.querySelectorAll('.fullscreen-container .slider-slide').forEach(slide => slide.remove());
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

			slider.addEventListener('wheel', function (e) {
				e.preventDefault();
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
				});
			});

			slider.querySelector('.close-btn').addEventListener('click', closeSlider);

			document.querySelector('.fullscreen-container.visible').addEventListener('click', function (e) {
				if (!e.target.closest('.fullScreen-slider')) closeSlider()
			});
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


	function createFullScreenSlider() {
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

		//Add slider Close
		const closeBtn = createCloseBtn();

		//Add slider container to page
		document.body.appendChild(fullScreenContainer);
		fullScreenContainer.appendChild(fullScreenBg);
		fullScreenContainer.appendChild(fullScreenSlider);
		fullScreenSlider.appendChild(sliderWrapper);
		fullScreenSlider.appendChild(sliderArrowsContainer);
		fullScreenSlider.appendChild(closeBtn);
		sliderArrowsContainer.appendChild(arrowWrapperRight);
		sliderArrowsContainer.appendChild(arrowWrapperLeft);
		arrowWrapperRight.appendChild(arrowRight);
		arrowWrapperLeft.appendChild(arrowLeft);
		arrowRight.appendChild(arrowSvg(arrowWrapperRight));
		arrowLeft.appendChild(arrowSvg(arrowWrapperLeft));
	}

	function createArrows() {
		const sliderArrowsContainer = document.createElement('div');
		sliderArrowsContainer.classList.add('slider-arrows');

		const arrowWrapperRight = document.createElement('div');
		arrowWrapperRight.classList.add('arrow-wrapper');
		arrowWrapperRight.classList.add('arrow-right');

		const arrowWrapperLeft = document.createElement('div');
		arrowWrapperLeft.classList.add('arrow-wrapper');
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

	function createCloseBtn() {
		const sliderClose = document.createElement('div');
		sliderClose.classList.add('close-btn');

		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		const iconPath = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'path'
		);
		svg.setAttribute('viewBox', '0 0 24 24');
		svg.setAttribute('width', '24');
		svg.setAttribute('height', '24');
		iconPath.setAttribute('fill', '#000');
		iconPath.setAttribute(
			'd',
			'M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z'
		)
		svg.appendChild(iconPath);
		sliderClose.appendChild(svg);
		return sliderClose;
	}

}

//Init functions
window.addEventListener('load', () => {
	if (window.innerWidth > 1199.98) {
		setTimeout(() => {
			ImageZoom();
			fullScreenSlider();
		}, 100)
	} else {
		setTimeout(() => {
			fullScreenSlider();
		}, 100)
	}
});