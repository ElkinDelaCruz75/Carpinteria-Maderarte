function Footer({ configuracion }) {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>{configuracion.nombreNegocio}</h3>
          <p>{configuracion.slogan}</p>
        </div>
        <div className="footer-section">
          <h4>Contacto</h4>
          <p>📍 {configuracion.direccion}</p>
          <p>📞 3136036717</p>
          <p>📧 carpinteriaeverdelacruz@gmail.com</p>
        </div>
        <div className="footer-section">
          <h4>Síguenos</h4>
          <div className="social-links">
            <a href={configuracion.facebook} target="_blank" rel="noreferrer">📘 Facebook</a>
            <a href={configuracion.instagram} target="_blank" rel="noreferrer">📸 Instagram</a>
            <a href="https://wa.me/3136036717" target="_blank" rel="noreferrer">💬 WhatsApp</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; 2026 {configuracion.nombreNegocio}. Todos los derechos reservados.</span>
        <span className="dev-credit">Desarrollador Web Elkin de la cruz cudris</span>
      </div>
    </footer>
  )
}

export default Footer
