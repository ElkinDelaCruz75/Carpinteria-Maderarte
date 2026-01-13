import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import ProductsGrid from './components/ProductsGrid'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AdminPanel from './components/AdminPanel'
import './index.css'

const productosIniciales = [
  {
    id: 1,
    categoria: 'cocinas',
    nombre: 'Cocina Integral Moderna',
    descripcion: 'Cocina completa con acabados en madera de roble y mármol',
    precio: '$15,000',
    imagenes: ['https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=500']
  },
  {
    id: 2,
    categoria: 'cocinas',
    nombre: 'Cocina Minimalista',
    descripcion: 'Diseño contemporáneo con líneas limpias',
    precio: '$12,000',
    imagenes: ['https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=500']
  },
  {
    id: 3,
    categoria: 'camas',
    nombre: 'Cama King Size',
    descripcion: 'Cama de madera maciza con diseño elegante',
    precio: '$8,000',
    imagenes: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500']
  },
  {
    id: 4,
    categoria: 'camas',
    nombre: 'Recámara Completa',
    descripcion: 'Set completo con cama, buró y closet',
    precio: '$18,000',
    imagenes: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500']
  },
  {
    id: 5,
    categoria: 'puertas',
    nombre: 'Puerta Principal Tallada',
    descripcion: 'Puerta de madera con tallados artesanales',
    precio: '$5,000',
    imagenes: ['https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=500']
  },
  {
    id: 6,
    categoria: 'ventanas',
    nombre: 'Ventanas de Madera',
    descripcion: 'Ventanas con marco de madera tratada',
    precio: '$3,500',
    imagenes: ['https://images.unsplash.com/photo-1545259742-24f9c8b0d9ab?w=500']
  }
]

const configuracionInicial = {
  nombreNegocio: 'Carpintería Maderarte',
  direccion: 'Av. Principal #123, Col. Centro, Ciudad',
  telefono: '+57 313 603 6717',
  email: 'contacto@maderarte.com',
  whatsapp: '573136036717',
  horario: 'Lun-Vie: 9am-6pm, Sáb: 9am-2pm',
  logo: '',
  colorPrincipal: '#8B4513',
  slogan: 'Muebles de calidad hechos con maestría',
  facebook: 'https://facebook.com/maderarte',
  instagram: 'https://instagram.com/maderarte'
}

function App() {
  // Cargar desde localStorage o usar iniciales
  const [productos, setProductos] = useState(() => {
    try {
      const saved = localStorage.getItem('productos')
      return saved ? JSON.parse(saved) : productosIniciales
    } catch {
      return productosIniciales
    }
  })

  const [configuracion, setConfiguracion] = useState(() => {
    try {
      const saved = localStorage.getItem('configuracion')
      const config = saved ? JSON.parse(saved) : configuracionInicial
      
      // Forzar actualización del WhatsApp si es necesario
      if (config.whatsapp !== '573136036717') {
        config.whatsapp = '573136036717'
        config.telefono = '+57 313 603 6717'
        localStorage.setItem('configuracion', JSON.stringify(config))
      }
      
      return config
    } catch {
      return configuracionInicial
    }
  })

  const [showAdmin, setShowAdmin] = useState(false)
  const [filtroCategoria, setFiltroCategoria] = useState('todos')

  // Guardar productos en localStorage cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem('productos', JSON.stringify(productos))
    } catch (e) {
      console.error('Error guardando productos:', e)
    }
  }, [productos])

  // Guardar configuración en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem('configuracion', JSON.stringify(configuracion))
    } catch (e) {
      console.error('Error guardando configuración:', e)
    }
  }, [configuracion])

  const productosFiltrados = filtroCategoria === 'todos' 
    ? productos 
    : productos.filter(p => p.categoria === filtroCategoria)

  return (
    <div className="app">
      <Header 
        configuracion={configuracion} 
        onAdminClick={() => setShowAdmin(true)} 
      />
      <Hero configuracion={configuracion} />
      <ProductsGrid 
        productos={productosFiltrados} 
        filtroCategoria={filtroCategoria}
        setFiltroCategoria={setFiltroCategoria}
        configuracion={configuracion}
      />
      <Contact configuracion={configuracion} />
      <Footer configuracion={configuracion} />
      
      {showAdmin && (
        <AdminPanel 
          productos={productos}
          setProductos={setProductos}
          configuracion={configuracion}
          setConfiguracion={setConfiguracion}
          onClose={() => setShowAdmin(false)}
        />
      )}
    </div>
  )
}

export default App
