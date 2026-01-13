import { useState } from 'react'

function Contact({ configuracion }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  })
  const [enviado, setEnviado] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Formulario enviado:', formData)
    setEnviado(true)
    setTimeout(() => setEnviado(false), 3000)
    setFormData({ nombre: '', email: '', telefono: '', mensaje: '' })
  }

  return (
    <section id="contacto" className="contact">
      <div className="contact-container">
        <div className="contact-info">
          <h2>📍 Encuéntranos</h2>
          <div className="info-item">
            <span className="icon">🏠</span>
            <div>
              <strong>Dirección</strong>
              <p>{configuracion.direccion}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="icon">📞</span>
            <div>
              <strong>Teléfono</strong>
              <p>{configuracion.telefono}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="icon">📧</span>
            <div>
              <strong>Email</strong>
              <p>{configuracion.email}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="icon">🕐</span>
            <div>
              <strong>Horario</strong>
              <p>{configuracion.horario}</p>
            </div>
          </div>
          <a 
            href={`https://wa.me/${configuracion.whatsapp}?text=Hola, me interesa obtener más información`} 
            className="whatsapp-big-btn"
            target="_blank" 
            rel="noreferrer"
          >
            💬 Escríbenos por WhatsApp
          </a>
        </div>

        <div className="contact-form">
          <h2>✉️ Contáctanos</h2>
          {enviado && <div className="success-message">¡Mensaje enviado correctamente!</div>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Tu email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="telefono"
              placeholder="Tu teléfono"
              value={formData.telefono}
              onChange={handleChange}
            />
            <textarea
              name="mensaje"
              placeholder="Tu mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              required
              rows="4"
            ></textarea>
            <button type="submit">Enviar Mensaje</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
