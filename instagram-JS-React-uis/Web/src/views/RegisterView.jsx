import { useState } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import { AuthForm } from '../components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerRequest } from '../api/auth';

function RegisterView({ onRegister, loading, error, termsLinks }) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    image: '',
  });

  const handleChange = (name, value) => {
    setValues({ ...values, [name]: value });
  };

  const navigate = useNavigate();
  const defaultTermsLinks = (
    <p>
      Al registrarte, aceptas nuestras{' '}
      <span style={{ color: '#7b6ef6', cursor: 'pointer' }}>Condiciones</span>,
      la{' '}
      <span style={{ color: '#7b6ef6', cursor: 'pointer' }}>
        Política de privacidad
      </span>{' '}
      y la{' '}
      <span style={{ color: '#7b6ef6', cursor: 'pointer' }}>
        Política de cookies
      </span>
      .
    </p>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerRequest(values);
      const authHeader =
        response.headers['authorization'] || response.headers['Authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        localStorage.setItem('token', authHeader.split(' ')[1]);
      }
      onRegister?.();
      navigate('/');
    } catch (err) {
      let message =
        err.response?.data?.error || err.message || 'Error al registrarse';

      if (message === 'image must be a valid URL') {
        message = 'La URL de imagen no es válida';
      } else if (message === 'name, email, password, and image are required') {
        message = 'Todos los campos son obligatorios';
      } else if (message === 'Email already exists') {
        message = 'El correo electrónico ya está en uso';
      }

      toast.error(message);
    }
  };
  return (
    <AuthLayout>
      <AuthForm
        fields={[
          { name: 'name', type: 'text', placeholder: 'Nombre' },
          { name: 'email', type: 'email', placeholder: 'Correo electrónico' },
          { name: 'password', type: 'password', placeholder: 'Contraseña' },
          { name: 'image', type: 'text', placeholder: 'Imagen' },
        ]}
        values={values}
        errors={error}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitting={loading}
        subtitle="Regístrate para ver fotos y videos de tus amigos."
        primaryActionLabel="Registrate"
        secondaryText="¿Tienes una cuenta?"
        secondaryActionLabel="Inicia Sesión"
        secondaryActionPath="/login"
        termsLinks={termsLinks || defaultTermsLinks}
      />
    </AuthLayout>
  );
}

export default RegisterView;
