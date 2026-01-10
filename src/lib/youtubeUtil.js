// 유튜브 URL에서 ID만 뽑아내는 함수
export function getYoutubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

export function getThumbUrl(youtubeUrl){
	const youtubeId = getYoutubeId(youtubeUrl)
	const thumbUrl = youtubeId? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg` : '';
	return thumbUrl;
}