import { useEffect, useState } from 'react';
import {
  getPostRequest,
  updatePostRequest,
  deletePostRequest,
  toggleLikeRequest,
  addCommentPostRequest,
} from '../api/posts';
import {
  PostDetailLayout,
  Modal,
  ImageUrlPreview,
  PostFormFields,
  MainButton,
} from '../components';
import { useParams, useNavigate } from 'react-router-dom';
import { getCurrentUserRequest } from '../api/users';
import { toast } from 'react-toastify';
import '../styles/PostFormView.css';

function PostDetailView() {
  const params = useParams();
  const postId = params.id;
  const [post, setPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getPostRequest(postId)
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [postId]);

  useEffect(() => {
    getCurrentUserRequest()
      .then((res) => {
        setCurrentUser(res.data);
      })
      .catch((err) => {
        console.error('Error al cargar el usuario:', err);
      });
  }, []);

  if (!post) return <div>Cargando...</div>; // modificar para mostrar un spinner o algo mas lindo

  const postOwnerId = post.user.id;
  const isLiked = !!post.likes?.some((like) => like.id === currentUser?.id);
  const postWithMeta = { ...post, isLiked };
  const isOwner = currentUser?.id === postOwnerId;

  const handleStartEdit = () => {
    if (!isOwner) return;
    setEditImageUrl(post.image || '');
    setEditDescription(post.description || '');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSubmitEdit = async () => {
    if (!editImageUrl || !editDescription) {
      toast.error('Debes ingresar una imagen y descripción');
      return;
    }

    setSaving(true);
    try {
      const res = await updatePostRequest(postId, {
        image: editImageUrl,
        description: editDescription,
      });
      setPost(res.data);
      setIsEditing(false);
      toast.success('Publicación actualizada');
    } catch (err) {
      const message =
        err.response?.data?.error || 'Error al actualizar la publicación';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!isOwner) return;
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deletePostRequest(postId);
      toast.success('Publicación eliminada');
      navigate('/');
    } catch (err) {
      const message =
        err.response?.data?.error || 'Error al eliminar la publicación';
      toast.error(message);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleToggleLike = async () => {
    try {
      const res = await toggleLikeRequest(postId);
      setPost(res.data);
    } catch (err) {
      const message =
        err.response?.data?.error || 'Error al actualizar el like';
      toast.error(message);
    }
  };

  const handleAddComment = async (text) => {
    try {
      const res = await addCommentPostRequest(postId, text);
      setPost(res.data);
    } catch (err) {
      const message =
        err.response?.data?.error || 'Error al agregar el comentario';
      toast.error(message);
    }
  };

  const handleUserClick = (userId) => {
    if (!userId) return;
    if (currentUser?.id && userId === currentUser.id) {
      navigate('/user_profile');
      return;
    }
    navigate(`/profile/${userId}`);
  };

  if (isEditing) {
    return (
      <div className="post-form-view">
        <h2 className="post-form-view__title">Preview</h2>
        <div className="post-form-view__body">
          <div className="post-form-view__preview">
            <ImageUrlPreview
              imageUrl={editImageUrl}
              fallbackType="placeholder"
            />
          </div>
          <div className="post-form-view__fields">
            <PostFormFields
              imageUrl={editImageUrl}
              description={editDescription}
              onImageUrlChange={setEditImageUrl}
              onDescriptionChange={setEditDescription}
            />
            <MainButton
              label={saving ? 'Guardando...' : 'Publicar'}
              onClick={handleSubmitEdit}
              disabled={saving || !editImageUrl || !editDescription}
              fullWidth={true}
            />
            <MainButton
              label="Cancelar"
              variant="secondary"
              onClick={handleCancelEdit}
              disabled={saving}
              fullWidth={true}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PostDetailLayout
        post={postWithMeta}
        isOwner={isOwner}
        comments={post.comments}
        onUserClick={handleUserClick}
        onToggleLike={handleToggleLike}
        onAddComment={handleAddComment}
        onEditPost={handleStartEdit}
        onDeletePost={handleDelete}
      />
      <Modal
        isOpen={showDeleteModal}
        title="Eliminar publicación"
        message="¿Seguro que querés eliminar esta publicación? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        isDanger={true}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
  //corregir Componentes de Postcard(ponerle avatar y los logos que corresponde, mas el css para uqe quede todo acomodado).
}

export default PostDetailView;
