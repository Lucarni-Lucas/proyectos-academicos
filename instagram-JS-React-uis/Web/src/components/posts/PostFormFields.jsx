import TextInput from '../App/text/TextInput';
import TextAreaInput from '../App/text/TextAreaInput';
import './PostFormFields.css';

function PostFormFields({
  imageUrl,
  description,
  onImageUrlChange,
  onDescriptionChange,
  imageError,
  descriptionError,
}) {
  return (
    <div className="post-form-fields">
      <div className="post-form-fields__group">
        <TextInput
          value={imageUrl}
          onChange={onImageUrlChange}
          placeholder="Url de la Imagen"
          error={imageError}
        />
      </div>

      <div className="post-form-fields__group">
        <TextAreaInput
          value={description}
          onChange={onDescriptionChange}
          placeholder="Agrega descripción"
          error={descriptionError}
        />
      </div>
    </div>
  );
}

export default PostFormFields;
