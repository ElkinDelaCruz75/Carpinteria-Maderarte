function Hero({ configuracion }) {
  return (
    <section id="hero" className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h2>Bienvenido a {configuracion.nombreNegocio}</h2>
        <p>{configuracion.slogan}</p>
        <div className="hero-buttons">
          <a href="#productos" className="cta-button">Ver Productos</a>
          <a href={`https://wa.me/${configuracion.whatsapp}`} className="whatsapp-button" target="_blank" rel="noreferrer">
            💬 WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
