const API_KEY = 'API_KEY';

const categories = {
	'Music': '10',
	'Gaming': '20',
	'Science/Tech': '28',
	'Entertainment': '24'
};

async function getVideos(category = categories['Science/Tech'], maxResults = 12) {
	const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&videoCategoryId=${category}&regionCode=US&maxResults=${maxResults}&key=${API_KEY}`;

	const videoResponse = await fetch(videoUrl);
	const videoData = await videoResponse.json();

	const channelIds = [...new Set(videoData.items.map(item => item.snippet.channelId))].join(',');

	const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds}&key=${API_KEY}`;
	const channelResponse = await fetch(channelUrl);
	const channelData = await channelResponse.json();

	const channelAvatars = {};
		channelData.items.forEach(channel => {
		channelAvatars[channel.id] = channel.snippet.thumbnails.default.url;
	});

	const recommendedFeed = videoData.items.map(video => {
		return {
			id: video.id,
			title: video.snippet.title,
			thumbnail: video.snippet.thumbnails.medium.url,
			duration: formatDuration(video.contentDetails.duration),
			views: formatViewCount(video.statistics.viewCount),
			publishedAt: formatPublishedAt(video.snippet.publishedAt),
			channelId: video.snippet.channelId,
			channelName: video.snippet.channelTitle,
			channelAvatar: channelAvatars[video.snippet.channelId] || 'https://placecats.com/300/200'
		};
	});

	console.log(recommendedFeed);

	return recommendedFeed;
}

function formatDuration(apiDuration) {
  const match = apiDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);

  if (hours > 0)
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function formatViewCount(views) {
  const num = Number(views);

  if (num >= 1e9)
	return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B views';
  if (num >= 1e6)
	return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M views';
  if (num >= 1e3)
	return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K views';

  return num + ' views';
}

function formatPublishedAt(publishedAt) {
	const publishDate = new Date(publishedAt);
	const now = new Date();

	const secDiff = Math.floor((now - publishDate) / 1e3);
	const minDiff = Math.floor(secDiff / 60);
	const hourDiff = Math.floor(minDiff / 60);
	const dayDiff = Math.floor(hourDiff / 24);
	const weekDiff = Math.floor(dayDiff / 7);
	const monthDiff = Math.floor(dayDiff / 30);
	const yearDiff = Math.floor(dayDiff / 365);

	if (yearDiff > 0)
		return `${yearDiff} year${yearDiff > 1 ? 's' : ''} ago`;
	if (monthDiff > 0)
		return `${monthDiff} month${monthDiff > 1 ? 's' : ''} ago`;
	if (weekDiff > 0)
		return `${weekDiff} week${weekDiff > 1 ? 's' : ''} ago`;
	if (dayDiff > 0)
		return `${dayDiff} day${dayDiff > 1 ? 's' : ''} ago`;
	if (hourDiff > 0)
		return `${hourDiff} hour${hourDiff > 1 ? 's' : ''} ago`;
	if (minDiff > 0)
		return `${minDiff} minute${minDiff > 1 ? 's' : ''} ago`;

	return `${secDiff} second${secDiff > 1 ? 's' : ''} ago`;
}