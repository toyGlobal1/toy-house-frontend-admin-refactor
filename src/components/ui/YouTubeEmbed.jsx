export function YouTubeEmbed({ src, title, width = 560, height = 315, ...props }) {
  return (
    <iframe
      src={src}
      title={title}
      width={width}
      height={height}
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
      {...props}></iframe>
  );
}
