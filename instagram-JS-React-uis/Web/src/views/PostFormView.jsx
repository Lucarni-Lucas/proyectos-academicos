import { useState } from 'react';
import { ImageUrlPreview, PostFormFields, MainButton } from '../components';
import '../styles/PostFormView.css';
import { useNavigate } from 'react-router-dom';
import { createPostRequest } from '../api/posts';
import { toast } from 'react-toastify';

function PostFormView() {
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!imageUrl || !description) {
      toast.error('Debes ingresar una imagen y descripción');
      return;
    }

    setSubmitting(true);
    try {
      await createPostRequest({ image: imageUrl, description });
      toast.success('Publicación creada exitosamente');
      navigate('/');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || 'Error al crear la publicación';
      toast.error(errorMessage);
      console.error('Error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="post-form-view">
      <h2 className="post-form-view__title">Preview</h2>

      <div className="post-form-view__body">
        <div className="post-form-view__preview">
          <ImageUrlPreview imageUrl={imageUrl} fallbackType="placeholder" />
        </div>

        <div className="post-form-view__fields">
          <PostFormFields
            imageUrl={imageUrl}
            description={description}
            onImageUrlChange={setImageUrl}
            onDescriptionChange={setDescription}
          />
          <MainButton
            label={submitting ? 'Publicando...' : 'Publicar'}
            onClick={handleSubmit}
            disabled={submitting || !imageUrl || !description}
            fullWidth={true}
          />
        </div>
      </div>
    </div>
  );
}

export default PostFormView;
