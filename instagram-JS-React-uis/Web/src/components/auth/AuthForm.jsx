import { Link } from 'react-router-dom';
import './Auth.css';
import MainButton from './../App/mainButton/MainButton';
import logoSrc from '../../assets/logo.png';

function AuthForm({
  fields,
  values,
  errors,
  onChange,
  onSubmit,
  submitting,
  primaryActionLabel,
  secondaryText,
  secondaryActionLabel,
  secondaryActionPath,
  subtitle,
  termsLinks,
}) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <img src={logoSrc} alt="Instagram" className="authform_logo" />
      {subtitle && <p className="authform_subtitle">{subtitle}</p>}

      {fields.map((field) => (
        <input
          key={field.name}
          type={field.type}
          placeholder={field.placeholder}
          value={values[field.name]}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      ))}

      {errors && <p style={{ color: 'red' }}>{errors}</p>}

      <MainButton
        label={primaryActionLabel}
        onClick={onSubmit}
        type="submit"
        disabled={submitting}
        fullWidth={true}
      />

      <div className="terms-links">{termsLinks}</div>

      <p>
        {secondaryText}{' '}
        <Link
          to={secondaryActionPath}
          style={{
            color: '#0095f6',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          {secondaryActionLabel}
        </Link>
      </p>
    </form>
  );
}

export default AuthForm;
