
export const getYoutubeId = (url: string) => {
  let videoId = '';
  if (url.includes('v=')) {
    videoId = url.split('v=')[1].split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('embed/')) {
    videoId = url.split('embed/')[1].split('?')[0];
  } else {
    videoId = url.split('/').pop() || '';
  }
  return videoId;
};

export const getYoutubeThumbnail = (url: string) => {
  const id = getYoutubeId(url);
  if (!id) return '';
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
};

export const getYoutubeEmbedUrl = (url: string) => {
  const id = getYoutubeId(url);
  if (!id) return '';
  return `https://www.youtube.com/embed/${id}?autoplay=1`;
};
