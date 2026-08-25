import MainButton from '../../App/mainButton/MainButton';
import './emptyStateImage.css';
import addPhoto from '../../../assets/addPhoto.png';

function EmptyStateImage({ title = 'Agregar imagen', icon = addPhoto }) {
  return (
    <section className="empty-state empty-state--image">
      <div className="empty-state__icon">
        {icon && <img className="empty-state__icon-image" src={icon} alt="" />}
      </div>
      {title && <h3 className="empty-state__title">{title}</h3>}
    </section>
  );
}

export default EmptyStateImage;
