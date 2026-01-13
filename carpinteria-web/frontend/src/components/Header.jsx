function Header({ configuracion, onAdminClick }) {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo-section">
          {configuracion.logo && <img src={configuracion.logo} alt="Logo" className="logo" />}
          <h1>{configuracion.nombreNegocio}</h1>
        </div>
        <ul>
          <li><a href="#hero">Inicio</a></li>
          <li><a href="#productos">Productos</a></li>
          <li><a href="#contacto">Contacto</a></li>
          <li>
            <button className="admin-btn" onClick={onAdminClick}>
              ⚙️ Admin
            </button>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
