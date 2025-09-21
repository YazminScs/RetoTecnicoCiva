import React, { useState, useEffect } from 'react';
import './App.css';

interface MarcaBus {
  idMarcaBus: number;
  nombreMarcaBus: string;
}

interface Bus {
  idBus?: number;
  numeroBus: string;
  placa: string;
  fechaCreacion?: string;
  caracteristicas: string;
  marcaBus: MarcaBus;
  activo: boolean;
}

interface BusApiResponse {
  content: Bus[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

interface User {
  username: string;
  password: string;
  role: string;
}

function App() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [checkingCredentials, setCheckingCredentials] = useState<boolean>(true);
  const [searchId, setSearchId] = useState<string>('');

  const API_URL = 'http://localhost:8080/bus';

  useEffect(() => {
    const savedCredentials = localStorage.getItem('busCredentials');
    if (savedCredentials) {
      const credentials = JSON.parse(savedCredentials);
      setUser(credentials);
      setIsLoggedIn(true);
      verifyCredentials(credentials);
    } else {
      setCheckingCredentials(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchBuses(currentPage);
    }
  }, [currentPage, isLoggedIn, user]);

  const verifyCredentials = async (credentials: User): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}?page=0&size=1`, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${credentials.username}:${credentials.password}`)
        }
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      setUser(credentials);
      setIsLoggedIn(true);
      setCheckingCredentials(false);
      setError(null);
    } catch (err) {
      localStorage.removeItem('busCredentials');
      setUser(null);
      setIsLoggedIn(false);
      setCheckingCredentials(false);
      setError('La sesión ha expirado. Por favor, inicie sesión nuevamente.');
    }
  };

  const fetchBuses = async (page: number): Promise<void> => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}?page=${page}&size=10`, {
        credentials: 'include',
        headers: {
          'Authorization': 'Basic ' + btoa(`${user.username}:${user.password}`)
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('busCredentials');
          setIsLoggedIn(false);
          setUser(null);
          throw new Error('La sesión ha expirado. Por favor, inicie sesión nuevamente.');
        }
        throw new Error('Error al obtener los datos de buses');
      }

      const data: BusApiResponse = await response.json();
      setBuses(data.content);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const searchBusById = async (): Promise<void> => {
    if (!searchId.trim()) {
      alert('Por favor, ingrese un ID válido');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${searchId}`, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${user?.username}:${user?.password}`)
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          alert(`No se encontró ningún bus con el ID: ${searchId}`);
        } else {
          throw new Error('Error al buscar el bus');
        }
        return;
      }

      const bus: Bus = await response.json();

      const busInfo = `
        🚌 INFORMACIÓN DEL BUS 🚌
        
        ID: ${bus.idBus}
        Número: ${bus.numeroBus}
        Placa: ${bus.placa}
        Marca: ${bus.marcaBus?.nombreMarcaBus}
        Características: ${bus.caracteristicas}
        Estado: ${bus.activo ? 'Activo ✅' : 'Inactivo ❌'}
        Fecha de Creación: ${bus.fechaCreacion ? new Date(bus.fechaCreacion).toLocaleDateString() : 'N/A'}
      `;

      alert(busInfo);
      setSearchId('');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      alert('Error al buscar el bus: ' + errorMessage);
    }
  };

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      setError(null);
      const response = await fetch(`${API_URL}?page=0&size=1`, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${loginForm.username}:${loginForm.password}`)
        }
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const role = loginForm.username === 'admin' ? 'ADMIN' : 'USER';

      const userData = {
        username: loginForm.username,
        password: loginForm.password,
        role: role
      };

      setUser(userData);
      setIsLoggedIn(true);
      setError(null);

      localStorage.setItem('busCredentials', JSON.stringify(userData));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de autenticación';
      setError(errorMessage);
    }
  };

  const handleLogout = (): void => {
    setIsLoggedIn(false);
    setUser(null);
    setBuses([]);
    localStorage.removeItem('busCredentials');
  };

  const handleDelete = async (idBus: number): Promise<void> => {
    if (!window.confirm('¿Seguro que deseas eliminar este bus?')) return;
    try {
      await fetch(`${API_URL}/${idBus}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic ' + btoa(`${user?.username}:${user?.password}`)
        }
      });
      fetchBuses(currentPage);
    } catch (err) {
      alert('Error al eliminar el bus');
    }
  };

  const handleFormSubmit = async (bus: Bus): Promise<void> => {
    try {
      const method = bus.idBus ? 'PUT' : 'POST';
      const url = bus.idBus ? `${API_URL}/${bus.idBus}` : API_URL;

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${user?.username}:${user?.password}`)
        },
        body: JSON.stringify(bus),
      });

      setShowForm(false);
      setEditingBus(null);
      fetchBuses(currentPage);
    } catch (err) {
      alert('Error al guardar el bus');
    }
  };

  const handlePrevPage = (): void => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = (): void => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  if (checkingCredentials) {
    return <div className="loading">Verificando credenciales...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Sistema de Gestión de Buses</h1>
          <p>Por favor, inicie sesión</p>
        </header>

        <div className="login-container">
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Iniciar Sesión</h2>

            {error && <div className="error">{error}</div>}

            <div className="form-group">
              <label htmlFor="username">Usuario:</label>
              <input
                type="text"
                id="username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                id="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>

            <button type="submit">Iniciar Sesión</button>

            <div className="demo-credentials">
              <p>Credenciales de demostración:</p>
              <p>Admin: usuario "admin", contraseña "admin123"</p>
              <p>Usuario: usuario "user", contraseña "password"</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistema de Gestión de Buses</h1>
        <div className="user-info">
          <span>Bienvenido, {user?.username} ({user?.role})</span>
          <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
        </div>
      </header>

      <main className="main-content">
        <div className="search-container">
          <div className="search-box">
            <label htmlFor="searchId">Buscar bus por ID:</label>
            <input
              type="number"
              id="searchId"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Ingrese el ID del bus"
              min="1"
            />
            <button onClick={searchBusById} className="search-btn">
              🔍 Buscar
            </button>
          </div>
        </div>

        {user?.role === 'ADMIN' && (
          <button
            className="add-btn"
            onClick={() => {
              setEditingBus(null);
              setShowForm(true);
            }}
          >
            ➕ Agregar Bus
          </button>
        )}

        {showForm && (
          <BusForm
            bus={editingBus}
            onCancel={() => {
              setShowForm(false);
              setEditingBus(null);
            }}
            onSubmit={handleFormSubmit}
          />
        )}

        <div className="table-container">
          <table className="buses-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Número</th>
                <th>Placa</th>
                <th>Marca</th>
                <th>Fecha Creacion</th>
                <th>Caracteristicas</th>
                <th>Estado</th>
                {user?.role === 'ADMIN' && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr key={bus.idBus}>
                  <td>{bus.idBus}</td>
                  <td>{bus.numeroBus}</td>
                  <td>{bus.placa}</td>
                  <td>{bus.marcaBus?.nombreMarcaBus}</td>
                  <td>{bus.fechaCreacion ? new Date(bus.fechaCreacion).toLocaleDateString() : 'N/A'}</td>
                  <td>{bus.caracteristicas}</td>
                  <td>{bus.activo ? 'Activo ✅' : 'Inactivo ❌'}</td>
                  {user?.role === 'ADMIN' && (
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setEditingBus(bus);
                          setShowForm(true);
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => bus.idBus && handleDelete(bus.idBus)}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 0}>
            Anterior
          </button>
          <span>
            Página {currentPage + 1} de {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
          >
            Siguiente
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;

//Componente para crear/editar buses
interface BusFormProps {
  bus: Bus | null;
  onSubmit: (bus: Bus) => void;
  onCancel: () => void;
}

const BusForm: React.FC<BusFormProps> = ({ bus, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Bus>(
    bus || {
      numeroBus: '',
      placa: '',
      caracteristicas: '',
      marcaBus: { idMarcaBus: 0, nombreMarcaBus: '' },
      activo: true,
    }
  );

  const [marcas, setMarcas] = useState<MarcaBus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('busCredentials') || '{}');

        const response = await fetch('http://localhost:8080/marca', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Authorization': 'Basic ' + btoa(`${user.username}:${user.password}`),
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setMarcas(data);
        } else {
          console.error('Error al obtener las marcas');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarcas();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'marcaBus') {
      const marcaSeleccionada = marcas.find(marca => marca.idMarcaBus === parseInt(value));
      if (marcaSeleccionada) {
        setFormData(prev => ({
          ...prev,
          marcaBus: marcaSeleccionada
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (loading) {
    return <div>Cargando marcas...</div>;
  }

  return (
    <form className="bus-form" onSubmit={handleSubmit}>
      <h2>{bus ? 'Editar Bus' : 'Agregar Bus'}</h2>

      <input
        type="text"
        name="numeroBus"
        placeholder="Número de Bus"
        value={formData.numeroBus}
        onChange={handleInputChange}
        required
      />

      <input
        type="text"
        name="placa"
        placeholder="Placa"
        value={formData.placa}
        onChange={handleInputChange}
        required
      />

      <input
        type="text"
        name="caracteristicas"
        placeholder="Características"
        value={formData.caracteristicas}
        onChange={handleInputChange}
      />

      <select
        name="marcaBus"
        value={formData.marcaBus.idMarcaBus}
        onChange={handleSelectChange}
        required
      >
        <option value="">Seleccione una marca</option>
        {marcas.map((marca) => (
          <option key={marca.idMarcaBus} value={marca.idMarcaBus}>
            {marca.nombreMarcaBus}
          </option>
        ))}
      </select>

      <label>
        <input
          type="checkbox"
          name="activo"
          checked={formData.activo}
          onChange={handleInputChange}
        />
        Activo
      </label>

      <div className="form-buttons">
        <button type="submit">{bus ? 'Actualizar' : 'Guardar'}</button>
        <button type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};