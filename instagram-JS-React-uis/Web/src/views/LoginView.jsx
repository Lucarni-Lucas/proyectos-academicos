import { useState } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import { AuthForm } from '../components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import sideImage from '../assets/loginPhoto.png';
import { loginRequest } from '../api/auth';

function LoginView({ onLogin, loading, error }) {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const handleChange = (name, value) => {
    setValues({ ...values, [name]: value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginRequest(values);
      const authHeader =
        response.headers['authorization'] || response.headers['Authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        localStorage.setItem('token', authHeader.split(' ')[1]);
      }
      onLogin?.();
      navigate('/');
    } catch (err) {
      let message =
        err.response?.data?.error || err.message || 'Error al iniciar sesión';

      if (message === 'Invalid credentials') {
        message = 'Credenciales inválidas';
      } else if (message === 'Login error') {
        message = 'Error al iniciar sesión';
      } else if (message === 'User not found') {
        message = 'Usuario no encontrado';
      } else if (message === 'Email and password are required') {
        message = 'El correo y la contraseña son obligatorios';
      }

      toast.error(message);
    }
  };

  return (
    <AuthLayout sideImageSrc={sideImage}>
      <AuthForm
        fields={[
          { name: 'email', type: 'email', placeholder: 'Correo electrónico' },
          { name: 'password', type: 'password', placeholder: 'Contraseña' },
        ]}
        values={values}
        errors={error}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitting={loading}
        primaryActionLabel="Iniciar sesión"
        secondaryText="¿No tienes una cuenta?"
        secondaryActionLabel="Regístrate"
        secondaryActionPath="/register"
      />
    </AuthLayout>
  );
}

export default LoginView;
