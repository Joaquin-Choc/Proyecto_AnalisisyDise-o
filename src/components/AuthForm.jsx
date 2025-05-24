import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthForm = ({ type }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: type === 'register' ? '' : undefined
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔧 Validación local para pruebas sin backend
    // Puedes eliminar este bloque si ya tienes el backend funcionando
    const dummyEmail = 'admin@test.com';
    const dummyPassword = 'admin123';
    if (type === 'login' && formData.email === dummyEmail && formData.password === dummyPassword) {
      const dummyUser = { name: 'Admin Test', email: dummyEmail };
      login('dummy-token', dummyUser); // Token falso
      return; // Salimos sin hacer fetch
    }

    // 👇 Código real para cuando está corriendo el backend
  // Por esto:
    const url = type === 'register'
      ? 'https://microservicio-auth-660835726359.northamerica-northeast2.run.app/register'
      : 'https://microservicio-auth-660835726359.northamerica-northeast2.run.app/login' ;

    const payload = type === 'register'
      ? { name: formData.name, email: formData.email, password: formData.password }
      : { email: formData.email, password: formData.password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        if (type === 'login') {
          login(data.token, data.user);
        } else {
          register(formData.email);
        }
      } else {
        alert(data.message || 'Ocurrió un error inesperado.');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <div className="auth-form">
      <h2>{type === 'login' ? 'Iniciar Sesión' : 'Registro'}</h2>
      <form onSubmit={handleSubmit}>
        {type === 'register' && (
          <div className="form-group">
            <label>Nombre completo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {type === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
        </button>
      </form>

      {type === 'login' && (
        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          <span>¿No tienes una cuenta? </span>
          <Link to="/register" style={{ color: '#007bff', textDecoration: 'underline' }}>
            Regístrate
          </Link>
        </div>
      )}

      {type === 'register' && (
        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          <span>¿Ya tienes una cuenta? </span>
          <Link to="/login" style={{ color: '#007bff', textDecoration: 'underline' }}>
            Inicia sesión
          </Link>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
