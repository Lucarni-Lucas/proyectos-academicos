import { EmptyStateImage } from './index.js';

function ImageUrlPreview({
  imageUrl,
  fallbackType = 'placeholder',
  onLoadError,
}) {
  const handleError = (e) => {
    onLoadError?.();
    // Oculta la imagen cuando falla
    e.target.style.display = 'none';
  };

  return (
    <div>
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt="Preview de la publicación"
            className="image-url-preview__img"
            onError={handleError}
          />
        </>
      ) : (
        <EmptyStateImage />
      )}
    </div>
  );
}

export default ImageUrlPreview;
