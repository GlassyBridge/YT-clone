function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'card';
    
		const thumbnail = document.createElement('div');
		thumbnail.className = 'thumbnail';

			const thumbnailImg = document.createElement('img');
			thumbnailImg.src = video.thumbnail;

			const duration = document.createElement('div');
			duration.className = 'duration';
			duration.textContent = video.duration;

		thumbnail.appendChild(thumbnailImg);
		thumbnail.appendChild(duration);

		const details = document.createElement('div');
		details.className = 'details';

			const pfp = document.createElement('div');
			pfp.className = 'pfp';
			// pfp.addEventListener('click', (e) => {
			// 	e.stopPropagation();
			// 	window.open(`https://www.youtube.com/channel/${video.channelId}`, '_blank');
			// });

				const pfpImg = document.createElement('img');
				pfpImg.src = video.channelAvatar;
				pfp.appendChild(pfpImg);
		
			const titleCnameStats = document.createElement('div');
			titleCnameStats.className = 'title-cname-stats';

				const title = document.createElement('div');
				title.className = 'title';
				title.textContent = video.title;

				const cname = document.createElement('div');
				cname.className = 'cname';
				cname.textContent = video.channelName;
				// cname.addEventListener('click', (e) => {
				// 	e.stopPropagation();
				// 	window.open(`https://www.youtube.com/channel/${video.channelId}`, '_blank');
				// });

				const stats = document.createElement('div');
				stats.className = 'stats';
				stats.innerHTML = `<span>${video.views}</span> • <span>${video.publishedAt}</span>`;

				const menuIcon = document.createElement('div');
				menuIcon.className = 'menu-icon';

				titleCnameStats.appendChild(title);
				titleCnameStats.appendChild(cname);
				titleCnameStats.appendChild(stats);

		details.appendChild(pfp);
		details.appendChild(titleCnameStats);
		details.appendChild(menuIcon);

	card.setAttribute('style', `--box-color: ${Math.random() * 256}, ${Math.random() * 256}, ${Math.random() * 256}`)
	card.appendChild(thumbnail);
	card.appendChild(details);
	card.addEventListener('click', (e) => {
		if ((e.target === cname) || (e.target === pfp)) {
			e.stopPropagation();
			window.open(`https://www.youtube.com/channel/${video.channelId}`, '_blank');
			return;
		}
		window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
	});

	return card;
}

const cardGrid = document.querySelector('.card-grid');

const videos = getVideos(categories['Science/Tech'], 30).then(videos => {
	videos.forEach(video => {
		const card = createVideoCard(video);
		cardGrid.appendChild(card);
	});
});

const fixedSidebar = document.querySelector('#fixed-sidebar');

const hamenu = document.querySelector('#hamenu');
let expanded = false;
hamenu.addEventListener('click', () => {
	if (expanded) {
		expanded = false;
		fixedSidebar.classList.add('expanded');
	} else {
		expanded = true;
		fixedSidebar.classList.remove('expanded');
	}
});