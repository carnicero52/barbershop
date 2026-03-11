'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Phone, MessageCircle, Calendar, Clock, MapPin, Mail, 
  Instagram, Facebook, Scissors, X, ImageIcon, Check, 
  Menu, Trash2, Plus, Settings, LogOut, ChevronRight, Upload,
  Star, Award, Users, Zap, ArrowRight, Play, ExternalLink
} from 'lucide-react';

// ========== TIPOS ==========
interface Configuracion {
  id: string;
  nombreNegocio: string;
  lema: string;
  logoUrl: string | null;
  telefono: string | null;
  whatsapp: string | null;
  email: string | null;
  direccion: string | null;
  mapaUrl: string | null;
  horarioLunes: string;
  horarioMartes: string;
  horarioMiercoles: string;
  horarioJueves: string;
  horarioViernes: string;
  horarioSabado: string;
  horarioDomingo: string;
  facebook: string | null;
  instagram: string | null;
  mensajeWhatsapp: string;
}

interface Servicio {
  id: string;
  nombre: string;
  precio: number;
  duracion: number;
  descripcion: string | null;
  imagenUrl: string | null;
  activo: boolean;
}

interface Corte {
  id: string;
  titulo: string;
  descripcion: string | null;
  imagenUrl: string | null;
  activo: boolean;
}

interface Cita {
  id: string;
  fecha: string;
  hora: string;
  clienteNombre: string;
  clienteTelefono: string;
  clienteEmail: string | null;
  estado: string;
  notas: string | null;
  servicio: Servicio;
}

// ========== HELPERS ==========
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem('adminToken'); } catch { return null; }
};

const setToken = (token: string) => {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem('adminToken', token); } catch {}
};

const removeToken = () => {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem('adminToken'); } catch {}
};

// ========== APP PRINCIPAL ==========
export default function App() {
  const [config, setConfig] = useState<Configuracion | null>(null);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cortes, setCortes] = useState<Corte[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [vista, setVista] = useState<'publica' | 'admin' | 'login'>('publica');
  const [adminLogueado, setAdminLogueado] = useState(false);
  const [seccionAdmin, setSeccionAdmin] = useState<'citas' | 'servicios' | 'galeria' | 'config'>('citas');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/configuracion').then(r => r.json()).then(setConfig).catch(() => {});
    fetch('/api/servicios').then(r => r.json()).then(setServicios).catch(() => {});
    fetch('/api/cortes').then(r => r.json()).then(setCortes).catch(() => {});
    fetch('/api/citas').then(r => r.json()).then(setCitas).catch(() => {}).finally(() => setLoading(false));
    
    const token = getToken();
    if (token) setAdminLogueado(true);
  }, []);

  const cargar = () => {
    fetch('/api/configuracion').then(r => r.json()).then(setConfig).catch(() => {});
    fetch('/api/servicios').then(r => r.json()).then(setServicios).catch(() => {});
    fetch('/api/cortes').then(r => r.json()).then(setCortes).catch(() => {});
    fetch('/api/citas').then(r => r.json()).then(setCitas).catch(() => {});
  };

  const whatsapp = () => {
    if (config?.whatsapp) {
      const n = config.whatsapp.replace(/\D/g, '');
      const m = encodeURIComponent(config.mensajeWhatsapp || 'Hola! Quiero agendar una cita.');
      window.open(`https://wa.me/${n}?text=${m}`, '_blank');
    }
  };

  const logout = () => { removeToken(); setAdminLogueado(false); setVista('publica'); };

  if (loading) return <LoadingScreen />;
  
  if (vista === 'login') return <Login setVista={setVista} setAdminLogueado={setAdminLogueado} config={config} />;
  if (vista === 'admin' && adminLogueado) return <Admin config={config} servicios={servicios} cortes={cortes} citas={citas} seccion={seccionAdmin} setSeccion={setSeccionAdmin} logout={logout} cargar={cargar} />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col overflow-x-hidden">
      {/* Navegación */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logo y Nombre */}
          <div className="flex items-center gap-4">
            {config?.logoUrl ? (
              <img src={config.logoUrl} alt="Logo" className="w-12 h-12 rounded-xl object-contain bg-neutral-900/80 p-1.5 border border-amber-500/20" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Scissors className="w-6 h-6 text-black" />
              </div>
            )}
            <div>
              <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">{config?.nombreNegocio || 'Barbería'}</h1>
              {config?.lema && <p className="text-xs text-amber-400/80 font-medium">{config.lema}</p>}
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <a href="#servicios" className="nav-link">Servicios</a>
            <a href="#galeria" className="nav-link">Galería</a>
            <a href="#contacto" className="nav-link">Contacto</a>
            <a href="#reservar" className="btn-primary">
              Reservar Cita <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMenuAbierto(!menuAbierto)} className="md:hidden p-2 text-neutral-400 hover:text-amber-400 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuAbierto && (
          <div className="md:hidden glass-dark border-t border-white/5 px-6 py-6 space-y-4">
            <a href="#servicios" onClick={() => setMenuAbierto(false)} className="block py-2 text-neutral-300 hover:text-amber-400 transition-colors">Servicios</a>
            <a href="#galeria" onClick={() => setMenuAbierto(false)} className="block py-2 text-neutral-300 hover:text-amber-400 transition-colors">Galería</a>
            <a href="#contacto" onClick={() => setMenuAbierto(false)} className="block py-2 text-neutral-300 hover:text-amber-400 transition-colors">Contacto</a>
            <a href="#reservar" onClick={() => setMenuAbierto(false)} className="btn-primary w-full text-center mt-4">Reservar Cita</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-[#0f0f0f]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(212,175,55,0.05),transparent_50%)]" />
        
        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-px h-32 bg-gradient-to-b from-transparent via-amber-500/30 to-transparent hidden lg:block" />
        <div className="absolute top-1/3 right-10 w-px h-48 bg-gradient-to-b from-transparent via-amber-500/20 to-transparent hidden lg:block" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-full mb-8 animate-fadeInUp">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span className="text-sm text-amber-400 font-medium">Abierto ahora • Citas disponibles</span>
          </div>
          
          {/* Logo Grande */}
          <div className="mb-8 animate-fadeInUp delay-100">
            {config?.logoUrl ? (
              <img src={config.logoUrl} alt="Logo" className="w-28 h-28 mx-auto rounded-2xl object-contain bg-neutral-900/50 p-3 border border-amber-500/20 shadow-2xl shadow-amber-500/10" />
            ) : (
              <div className="w-28 h-28 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/30 animate-pulse-glow">
                <Scissors className="w-14 h-14 text-black" />
              </div>
            )}
          </div>
          
          {/* Título Principal */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fadeInUp delay-200 leading-tight">
            <span className="text-gradient-gold">{config?.nombreNegocio || 'Barbería Premium'}</span>
          </h1>
          
          {/* Subtítulo */}
          <p className="text-lg sm:text-xl text-neutral-400 mb-12 max-w-2xl mx-auto animate-fadeInUp delay-300 leading-relaxed">
            {config?.lema || 'Donde el estilo se encuentra con la elegancia. Profesionales dedicados a realzar tu imagen con cortes de alta calidad.'}
          </p>
          
          {/* Botones CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp delay-400">
            <a href="#reservar" className="btn-primary text-lg px-10 py-4 group">
              Agendar Cita 
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            <button onClick={whatsapp} className="btn-outline text-lg px-10 py-4 group">
              <MessageCircle className="w-5 h-5 mr-2 text-green-500" /> 
              WhatsApp
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 animate-fadeInUp delay-500">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gradient-gold mb-1">500+</div>
              <div className="text-xs sm:text-sm text-neutral-500 uppercase tracking-wider">Clientes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gradient-gold mb-1">10+</div>
              <div className="text-xs sm:text-sm text-neutral-500 uppercase tracking-wider">Años</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gradient-gold mb-1">5★</div>
              <div className="text-xs sm:text-sm text-neutral-500 uppercase tracking-wider">Rating</div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-amber-500/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-amber-500/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.03),transparent_70%)]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-4">Nuestros Servicios</span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-gradient-gold">Servicios Premium</span>
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">Experiencia de barbería de alta calidad con productos premium y profesionales certificados</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {servicios.filter(s => s.activo).map((servicio, index) => (
              <div key={servicio.id} className="service-card group" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="service-image">
                  {servicio.imagenUrl ? (
                    <img src={servicio.imagenUrl} alt={servicio.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                      <Scissors className="w-16 h-16 text-neutral-700" />
                    </div>
                  )}
                  <div className="service-overlay" />
                  <div className="service-price">${servicio.precio}</div>
                </div>
                <div className="service-content">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-amber-400 transition-colors">{servicio.nombre}</h3>
                  <p className="text-neutral-400 text-sm mb-4 line-clamp-2">{servicio.descripcion || 'Servicio profesional de calidad con productos premium'}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-neutral-500 text-sm">
                      <Clock className="w-4 h-4 text-amber-500/60" />
                      <span>{servicio.duracion} min</span>
                    </div>
                    <a href="#reservar" className="text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors flex items-center gap-1 group/btn">
                      Reservar <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {servicios.filter(s => s.activo).length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-neutral-900 flex items-center justify-center border border-neutral-800">
                <Scissors className="w-12 h-12 text-neutral-700" />
              </div>
              <p className="text-neutral-500 text-lg">No hay servicios disponibles</p>
            </div>
          )}
        </div>
      </section>

      {/* Galería */}
      <section id="galeria" className="relative py-24 sm:py-32 bg-[#050505]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.05),transparent_50%)]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-4">Nuestros Trabajos</span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-gradient-gold">Galería de Estilos</span>
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">Descubre los mejores cortes y estilos que hemos creado para nuestros clientes</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {cortes.filter(c => c.activo).map((corte, index) => (
              <div 
                key={corte.id} 
                className="gallery-item group cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setLightboxImage(corte.imagenUrl)}
              >
                {corte.imagenUrl ? (
                  <img src={corte.imagenUrl} alt={corte.titulo} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                    <ImageIcon className="w-12 h-12 text-neutral-700" />
                  </div>
                )}
                <div className="gallery-overlay">
                  <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="font-semibold text-lg mb-1">{corte.titulo}</h4>
                    {corte.descripcion && <p className="text-neutral-400 text-sm">{corte.descripcion}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {cortes.filter(c => c.activo).length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-neutral-900 flex items-center justify-center border border-neutral-800">
                <ImageIcon className="w-12 h-12 text-neutral-700" />
              </div>
              <p className="text-neutral-500 text-lg">No hay trabajos en la galería</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
          <button 
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-neutral-900/80 border border-neutral-700 flex items-center justify-center hover:bg-neutral-800 transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={lightboxImage} 
            alt="Vista ampliada" 
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl animate-scaleIn"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      {/* Reservar */}
      <section id="reservar" className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(212,175,55,0.05),transparent_50%)]" />
        
        <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-4">Reservaciones</span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-gradient-gold">Agenda tu Cita</span>
            </h2>
            <p className="text-neutral-400 text-lg">Selecciona tu servicio, fecha y hora preferida</p>
          </div>
          <FormCita servicios={servicios} />
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="relative py-24 sm:py-32 bg-[#050505]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.03),transparent_70%)]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-4">Contacto</span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-gradient-gold">Encuéntranos</span>
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">Estamos aquí para atenderte. Visítanos o contáctanos por cualquiera de estos medios</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Info Cards */}
            <div className="space-y-6">
              {/* Ubicación */}
              <div className="contact-card">
                <div className="contact-icon">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-1">Ubicación</h4>
                  <p className="text-neutral-400">{config?.direccion || 'No configurada'}</p>
                </div>
              </div>

              {/* Contacto */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="contact-card">
                  <div className="contact-icon">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Teléfono</h4>
                    <p className="text-neutral-400 text-sm">{config?.telefono || 'No configurado'}</p>
                  </div>
                </div>
                <div className="contact-card">
                  <div className="contact-icon">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-neutral-400 text-sm truncate">{config?.email || 'No configurado'}</p>
                  </div>
                </div>
              </div>

              {/* Horarios */}
              <div className="contact-card">
                <div className="contact-icon">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-3">Horario de Atención</h4>
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Lunes - Viernes</span>
                      <span className="text-white">{config?.horarioLunes || 'Cerrado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Sábado</span>
                      <span className="text-white">{config?.horarioSabado || 'Cerrado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Domingo</span>
                      <span className="text-white">{config?.horarioDomingo || 'Cerrado'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Redes Sociales y CTA */}
            <div className="space-y-6">
              {/* Social */}
              <div className="contact-card justify-center text-center">
                <div className="w-full">
                  <h4 className="font-semibold text-lg mb-6">Síguenos en Redes</h4>
                  <div className="flex justify-center gap-4">
                    {config?.instagram && (
                      <button 
                        onClick={() => window.open(config.instagram.startsWith('http') ? config.instagram : `https://instagram.com/${config.instagram}`, '_blank')} 
                        className="social-btn bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500"
                      >
                        <Instagram className="w-6 h-6" />
                      </button>
                    )}
                    {config?.facebook && (
                      <button 
                        onClick={() => window.open(config.facebook, '_blank')}
                        className="social-btn bg-[#1877F2]"
                      >
                        <Facebook className="w-6 h-6" />
                      </button>
                    )}
                    {config?.whatsapp && (
                      <button onClick={whatsapp} className="social-btn bg-[#25D366]">
                        <MessageCircle className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="grid sm:grid-cols-2 gap-4">
                <button onClick={whatsapp} className="cta-card bg-gradient-to-br from-[#25D366] to-[#128C7E]">
                  <MessageCircle className="w-8 h-8 mb-2" />
                  <span className="font-semibold text-lg">WhatsApp</span>
                  <span className="text-white/70 text-sm">Respuesta inmediata</span>
                </button>
                <a href="#reservar" className="cta-card bg-gradient-to-br from-amber-500 to-amber-600 text-black">
                  <Calendar className="w-8 h-8 mb-2" />
                  <span className="font-semibold text-lg">Reservar</span>
                  <span className="text-black/60 text-sm">Agenda tu cita</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-neutral-800/50 py-12 bg-[#030303]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {config?.logoUrl ? (
                <img src={config.logoUrl} alt="Logo" className="w-10 h-10 rounded-lg object-contain bg-neutral-900 p-1" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-black" />
                </div>
              )}
              <div>
                <span className="font-semibold">{config?.nombreNegocio || 'Barbería'}</span>
                {config?.lema && <p className="text-xs text-neutral-500">{config.lema}</p>}
              </div>
            </div>
            
            <p className="text-neutral-600 text-sm">© {new Date().getFullYear()} Todos los derechos reservados</p>
            
            <button onClick={() => setVista('login')} className="text-neutral-600 text-sm hover:text-amber-400 transition-colors flex items-center gap-1 group">
              <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              Admin
            </button>
          </div>
        </div>
      </footer>

      {/* WhatsApp flotante */}
      {config?.whatsapp && (
        <button onClick={whatsapp} className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-2xl shadow-lg shadow-green-500/30 flex items-center justify-center hover:scale-110 hover:shadow-xl hover:shadow-green-500/40 transition-all z-50 group">
          <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
}

// ========== LOADING ==========
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 animate-pulse" />
          <div className="absolute inset-1 rounded-xl bg-[#0a0a0a] flex items-center justify-center">
            <Scissors className="w-8 h-8 text-amber-500 animate-spin" style={{ animationDuration: '2s' }} />
          </div>
        </div>
        <p className="text-neutral-500 text-sm">Cargando...</p>
      </div>
    </div>
  );
}

// ========== FORM CITA ==========
function FormCita({ servicios }: { servicios: Servicio[] }) {
  const [data, setData] = useState({ clienteNombre: '', clienteTelefono: '', clienteEmail: '', servicioId: '', fecha: '', hora: '', notas: '' });
  const [ocupadas, setOcupadas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const horas = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00'];

  useEffect(() => {
    if (data.fecha) fetch(`/api/citas?fecha=${data.fecha}`).then(r => r.json()).then(d => setOcupadas(d.filter((c: Cita) => c.estado !== 'cancelada').map((c: Cita) => c.hora))).catch(() => setOcupadas([]));
  }, [data.fecha]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/citas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const d = await res.json();
      if (d.success) setOk(true);
      else alert(d.error || 'Error');
    } catch { alert('Error'); }
    finally { setLoading(false); }
  };

  if (ok) return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-3xl p-12 text-center border border-neutral-800 animate-fadeIn">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center mx-auto mb-6 border border-green-500/20">
        <Check className="w-12 h-12 text-green-500" />
      </div>
      <h3 className="text-3xl font-bold mb-3 text-gradient-gold">¡Cita Agendada!</h3>
      <p className="text-neutral-400">Te esperamos en tu fecha programada</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-3xl p-6 sm:p-10 border border-neutral-800 space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <input required placeholder="Nombre completo *" value={data.clienteNombre} onChange={e => setData({...data, clienteNombre: e.target.value})} className="form-input" />
        <input required placeholder="Teléfono *" value={data.clienteTelefono} onChange={e => setData({...data, clienteTelefono: e.target.value})} className="form-input" />
      </div>
      <input placeholder="Email (opcional)" value={data.clienteEmail} onChange={e => setData({...data, clienteEmail: e.target.value})} className="form-input" />
      <select required value={data.servicioId} onChange={e => setData({...data, servicioId: e.target.value})} className="form-input">
        <option value="">Selecciona un servicio *</option>
        {servicios.filter(s => s.activo).map(s => <option key={s.id} value={s.id}>{s.nombre} - ${s.precio}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-4">
        <input type="date" required min={new Date().toISOString().split('T')[0]} value={data.fecha} onChange={e => setData({...data, fecha: e.target.value})} className="form-input" />
        <select required value={data.hora} onChange={e => setData({...data, hora: e.target.value})} className="form-input">
          <option value="">Hora *</option>
          {horas.map(h => <option key={h} value={h} disabled={ocupadas.includes(h)}>{h}</option>)}
        </select>
      </div>
      <textarea placeholder="Notas adicionales (opcional)" value={data.notas} onChange={e => setData({...data, notas: e.target.value})} className="form-input resize-none" rows={3} />
      <button disabled={loading} className="btn-primary w-full py-4 text-lg disabled:opacity-50">
        {loading ? 'Agendando...' : 'Confirmar Cita'}
      </button>
    </form>
  );
}

// ========== LOGIN ==========
function Login({ setVista, setAdminLogueado, config }: { setVista: (v: 'publica' | 'admin' | 'login') => void; setAdminLogueado: (v: boolean) => void; config: Configuracion | null }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: user, password: pass }) });
      const d = await res.json();
      if (d.success) { setToken(d.token); setAdminLogueado(true); setVista('admin'); }
      else setErr(d.error || 'Error');
    } catch { setErr('Error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-amber-500/20">
            <Scissors className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-gradient-gold">Panel Admin</h1>
          <p className="text-neutral-500 mt-2">{config?.nombreNegocio}</p>
        </div>
        <form onSubmit={submit} className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-3xl p-8 border border-neutral-800 space-y-5">
          <input required placeholder="Usuario" value={user} onChange={e => setUser(e.target.value)} className="form-input" />
          <input type="password" required placeholder="Contraseña" value={pass} onChange={e => setPass(e.target.value)} className="form-input" />
          {err && <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{err}</p>}
          <button disabled={loading} className="btn-primary w-full py-4 disabled:opacity-50">
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
        <button onClick={() => setVista('publica')} className="w-full mt-6 text-neutral-500 hover:text-amber-400 transition-colors flex items-center justify-center gap-2">
          <ChevronRight className="w-4 h-4 rotate-180" /> Volver al inicio
        </button>
      </div>
    </div>
  );
}

// ========== ADMIN ==========
function Admin({ config, servicios, cortes, citas, seccion, setSeccion, logout, cargar }: {
  config: Configuracion | null;
  servicios: Servicio[];
  cortes: Corte[];
  citas: Cita[];
  seccion: 'citas' | 'servicios' | 'galeria' | 'config';
  setSeccion: (s: 'citas' | 'servicios' | 'galeria' | 'config') => void;
  logout: () => void;
  cargar: () => void;
}) {
  const navItems = [
    { id: 'citas' as const, label: 'Citas', icon: Calendar },
    { id: 'servicios' as const, label: 'Servicios', icon: Scissors },
    { id: 'galeria' as const, label: 'Galería', icon: ImageIcon },
    { id: 'config' as const, label: 'Config', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-neutral-950 to-black border-r border-neutral-800/50 p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-4 mb-10">
          {config?.logoUrl ? (
            <img src={config.logoUrl} alt="Logo" className="w-12 h-12 rounded-xl object-contain bg-neutral-900 p-1.5 border border-amber-500/20" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Scissors className="w-6 h-6 text-black" />
            </div>
          )}
          <div>
            <p className="font-semibold">{config?.nombreNegocio}</p>
            <p className="text-xs text-amber-400/70">Panel Admin</p>
          </div>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setSeccion(item.id)} className={`nav-btn ${seccion === item.id ? 'active' : ''}`}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <button onClick={logout} className="flex items-center gap-3 px-5 py-3 text-neutral-500 hover:text-red-400 rounded-xl transition-colors mt-4 group">
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Cerrar sesión
        </button>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 glass-nav p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold">{config?.nombreNegocio}</span>
          <button onClick={logout} className="text-neutral-500 hover:text-red-400 p-2"><LogOut className="w-5 h-5" /></button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setSeccion(item.id)} className={`px-5 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all ${seccion === item.id ? 'bg-amber-500 text-black font-medium shadow-lg shadow-amber-500/20' : 'bg-neutral-800/50 text-neutral-400'}`}>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 p-6 sm:p-10 pt-28 md:pt-10 overflow-auto">
        {seccion === 'citas' && <AdminCitas citas={citas} cargar={cargar} />}
        {seccion === 'servicios' && <AdminServicios servicios={servicios} cargar={cargar} />}
        {seccion === 'galeria' && <AdminGaleria cortes={cortes} cargar={cargar} />}
        {seccion === 'config' && <AdminConfig config={config} cargar={cargar} />}
      </main>
    </div>
  );
}

// ========== ADMIN CITAS ==========
function AdminCitas({ citas, cargar }: { citas: Cita[]; cargar: () => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gradient-gold">Gestión de Citas</h2>
        <span className="text-neutral-500 text-sm">{citas.length} citas</span>
      </div>
      {citas.length === 0 ? (
        <div className="text-center py-20 bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-3xl border border-neutral-800">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-neutral-800 flex items-center justify-center">
            <Calendar className="w-10 h-10 text-neutral-700" />
          </div>
          <p className="text-neutral-500 text-lg">No hay citas registradas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {citas.map(c => (
            <div key={c.id} className="admin-card group">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-lg">{c.clienteNombre}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.estado === 'confirmada' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : c.estado === 'cancelada' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                      {c.estado}
                    </span>
                  </div>
                  <p className="text-neutral-400">{c.servicio?.nombre} • {c.fecha} a las {c.hora}</p>
                </div>
                <div className="flex items-center gap-3">
                  <select value={c.estado} onChange={async (e) => { await fetch(`/api/citas/${c.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado: e.target.value }) }); cargar(); }} className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-sm outline-none focus:border-amber-500/50 transition-colors">
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                  <button onClick={async () => { if(confirm('¿Eliminar esta cita?')) { await fetch(`/api/citas/${c.id}`, { method: 'DELETE' }); cargar(); }}} className="p-2.5 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ========== ADMIN SERVICIOS ==========
function AdminServicios({ servicios, cargar }: { servicios: Servicio[]; cargar: () => void }) {
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<Servicio | null>(null);
  const [data, setData] = useState({ nombre: '', precio: '', duracion: '', descripcion: '', imagenUrl: '' });
  const [uploading, setUploading] = useState(false);

  const abrir = (s?: Servicio) => {
    if (s) { setEdit(s); setData({ nombre: s.nombre, precio: String(s.precio), duracion: String(s.duracion), descripcion: s.descripcion || '', imagenUrl: s.imagenUrl || '' }); }
    else { setEdit(null); setData({ nombre: '', precio: '', duracion: '', descripcion: '', imagenUrl: '' }); }
    setModal(true);
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        setData({...data, imagenUrl: reader.result as string});
        setUploading(false);
      };
      reader.onerror = () => {
        alert('Error al leer la imagen');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
    }
  };

  const guardar = async () => {
    if (!data.nombre || !data.precio || !data.duracion) {
      alert('Completa los campos obligatorios');
      return;
    }
    await fetch(edit ? `/api/servicios/${edit.id}` : '/api/servicios', { method: edit ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, precio: Number(data.precio), duracion: Number(data.duracion) }) });
    setModal(false); cargar();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gradient-gold">Servicios</h2>
        <button onClick={() => abrir()} className="btn-primary">
          <Plus className="w-5 h-5 mr-2" /> Nuevo Servicio
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {servicios.map(s => (
          <div key={s.id} className={`admin-card overflow-hidden ${!s.activo ? 'opacity-50' : ''}`}>
            <div className="h-40 bg-neutral-800 relative">
              {s.imagenUrl ? <img src={s.imagenUrl} alt={s.nombre} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Scissors className="w-12 h-12 text-neutral-700" /></div>}
              {!s.activo && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="px-3 py-1 bg-neutral-800 rounded-full text-xs text-neutral-400">Inactivo</span></div>}
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg">{s.nombre}</span>
                <span className="text-amber-400 font-bold text-xl">${s.precio}</span>
              </div>
              <p className="text-neutral-500 text-sm mb-4">{s.duracion} minutos</p>
              <div className="flex gap-2">
                <button onClick={() => abrir(s)} className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-sm transition-colors">Editar</button>
                <button onClick={async () => { await fetch(`/api/servicios/${s.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ activo: !s.activo }) }); cargar(); }} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${s.activo ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}>
                  {s.activo ? 'Activo' : 'Off'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-3xl p-8 border border-neutral-800 max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-semibold text-gradient-gold">{edit ? 'Editar' : 'Nuevo'} Servicio</h3>
              <button onClick={() => setModal(false)} className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-5">
              {/* Preview + Upload */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-neutral-800 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-neutral-700">
                  {data.imagenUrl ? <img src={data.imagenUrl} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-neutral-600" />}
                </div>
                <label className="flex-1 cursor-pointer">
                  <div className={`py-4 px-5 border-2 border-dashed border-neutral-700 rounded-2xl text-center hover:border-amber-500/50 transition-colors ${uploading ? 'opacity-50' : ''}`}>
                    <Upload className="w-6 h-6 mx-auto mb-2 text-neutral-500" />
                    <span className="text-sm text-neutral-400">{uploading ? 'Subiendo...' : 'Subir archivo'}</span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImage} className="hidden" disabled={uploading} />
                </label>
              </div>
              
              {/* URL Field */}
              <div className="relative">
                <input placeholder="O pega aquí la URL de la imagen" value={data.imagenUrl} onChange={e => setData({...data, imagenUrl: e.target.value})} className="form-input pr-10" />
                {data.imagenUrl && (
                  <button type="button" onClick={() => setData({...data, imagenUrl: ''})} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-red-400 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <input placeholder="Nombre del servicio *" value={data.nombre} onChange={e => setData({...data, nombre: e.target.value})} className="form-input" />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Precio *" type="number" value={data.precio} onChange={e => setData({...data, precio: e.target.value})} className="form-input" />
                <input placeholder="Duración (min) *" type="number" value={data.duracion} onChange={e => setData({...data, duracion: e.target.value})} className="form-input" />
              </div>
              <textarea placeholder="Descripción" value={data.descripcion} onChange={e => setData({...data, descripcion: e.target.value})} className="form-input resize-none" rows={3} />
              <button onClick={guardar} className="btn-primary w-full py-4">Guardar Servicio</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ========== ADMIN GALERÍA ==========
function AdminGaleria({ cortes, cargar }: { cortes: Corte[]; cargar: () => void }) {
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<Corte | null>(null);
  const [data, setData] = useState({ titulo: '', descripcion: '', imagenUrl: '' });

  const abrir = (c?: Corte) => {
    if (c) { setEdit(c); setData({ titulo: c.titulo, descripcion: c.descripcion || '', imagenUrl: c.imagenUrl || '' }); }
    else { setEdit(null); setData({ titulo: '', descripcion: '', imagenUrl: '' }); }
    setModal(true);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setData({...data, imagenUrl: reader.result as string});
      reader.readAsDataURL(file);
    }
  };

  const guardar = async () => {
    await fetch(edit ? `/api/cortes/${edit.id}` : '/api/cortes', { method: edit ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    setModal(false); cargar();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gradient-gold">Galería</h2>
        <button onClick={() => abrir()} className="btn-primary">
          <Plus className="w-5 h-5 mr-2" /> Nueva Imagen
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {cortes.map(c => (
          <div key={c.id} className={`admin-card overflow-hidden ${!c.activo ? 'opacity-50' : ''}`}>
            <div className="aspect-square bg-neutral-800 relative">
              {c.imagenUrl ? <img src={c.imagenUrl} alt={c.titulo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-10 h-10 text-neutral-700" /></div>}
              {!c.activo && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="px-3 py-1 bg-neutral-800 rounded-full text-xs text-neutral-400">Inactivo</span></div>}
            </div>
            <div className="p-4">
              <p className="font-medium truncate mb-3">{c.titulo}</p>
              <div className="flex gap-2">
                <button onClick={() => abrir(c)} className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm transition-colors">Editar</button>
                <button onClick={async () => { await fetch(`/api/cortes/${c.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ activo: !c.activo }) }); cargar(); }} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${c.activo ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {c.activo ? 'On' : 'Off'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-3xl p-8 border border-neutral-800 max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-semibold text-gradient-gold">{edit ? 'Editar' : 'Nueva'} Imagen</h3>
              <button onClick={() => setModal(false)} className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-5">
              {/* Preview + Upload */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-neutral-800 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-neutral-700">
                  {data.imagenUrl ? <img src={data.imagenUrl} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-neutral-600" />}
                </div>
                <label className="flex-1 cursor-pointer">
                  <div className="py-4 px-5 border-2 border-dashed border-neutral-700 rounded-2xl text-center hover:border-amber-500/50 transition-colors">
                    <Upload className="w-6 h-6 mx-auto mb-2 text-neutral-500" />
                    <span className="text-sm text-neutral-400">Subir archivo</span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                </label>
              </div>
              
              {/* URL Field */}
              <div className="relative">
                <input placeholder="O pega aquí la URL de la imagen" value={data.imagenUrl} onChange={e => setData({...data, imagenUrl: e.target.value})} className="form-input pr-10" />
                {data.imagenUrl && (
                  <button type="button" onClick={() => setData({...data, imagenUrl: ''})} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-red-400 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <input placeholder="Título *" value={data.titulo} onChange={e => setData({...data, titulo: e.target.value})} className="form-input" />
              <textarea placeholder="Descripción" value={data.descripcion} onChange={e => setData({...data, descripcion: e.target.value})} className="form-input resize-none" rows={3} />
              <button onClick={guardar} className="btn-primary w-full py-4">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ========== ADMIN CONFIG ==========
function AdminConfig({ config, cargar }: { config: Configuracion | null; cargar: () => void }) {
  const [data, setData] = useState({
    nombreNegocio: config?.nombreNegocio || '',
    lema: config?.lema || '',
    telefono: config?.telefono || '',
    whatsapp: config?.whatsapp || '',
    email: config?.email || '',
    direccion: config?.direccion || '',
    mapaUrl: config?.mapaUrl || '',
    facebook: config?.facebook || '',
    instagram: config?.instagram || '',
    horarioLunes: config?.horarioLunes || '',
    horarioMartes: config?.horarioMartes || '',
    horarioMiercoles: config?.horarioMiercoles || '',
    horarioJueves: config?.horarioJueves || '',
    horarioViernes: config?.horarioViernes || '',
    horarioSabado: config?.horarioSabado || '',
    horarioDomingo: config?.horarioDomingo || '',
    mensajeWhatsapp: config?.mensajeWhatsapp || '',
    logoUrl: config?.logoUrl || ''
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setData({...data, logoUrl: reader.result as string});
      reader.readAsDataURL(file);
    }
  };

  const guardar = async () => {
    setSaving(true);
    try {
      await fetch('/api/configuracion', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      cargar();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
    setSaving(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gradient-gold mb-8">Configuración</h2>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Negocio */}
        <div className="admin-card space-y-5">
          <h3 className="font-semibold text-amber-400 flex items-center gap-2 text-lg">
            <Scissors className="w-5 h-5" /> Información del Negocio
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-neutral-700">
              {data.logoUrl ? <img src={data.logoUrl} alt="Logo" className="w-full h-full object-contain" /> : <Scissors className="w-6 h-6 text-neutral-600" />}
            </div>
            <label className="flex-1 cursor-pointer">
              <div className="py-3 px-4 border-2 border-dashed border-neutral-700 rounded-xl text-center hover:border-amber-500/50 transition-colors">
                <Upload className="w-5 h-5 mx-auto mb-1 text-neutral-500" />
                <span className="text-sm text-neutral-400">Cambiar logo</span>
              </div>
              <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
            </label>
          </div>
          <input placeholder="Nombre del negocio" value={data.nombreNegocio} onChange={e => setData({...data, nombreNegocio: e.target.value})} className="form-input" />
          <input placeholder="Lema / Eslogan" value={data.lema} onChange={e => setData({...data, lema: e.target.value})} className="form-input" />
        </div>

        {/* Contacto */}
        <div className="admin-card space-y-5">
          <h3 className="font-semibold text-amber-400 flex items-center gap-2 text-lg">
            <Phone className="w-5 h-5" /> Contacto
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Teléfono" value={data.telefono} onChange={e => setData({...data, telefono: e.target.value})} className="form-input" />
            <input placeholder="WhatsApp" value={data.whatsapp} onChange={e => setData({...data, whatsapp: e.target.value})} className="form-input" />
          </div>
          <input placeholder="Email" value={data.email} onChange={e => setData({...data, email: e.target.value})} className="form-input" />
          <input placeholder="Dirección" value={data.direccion} onChange={e => setData({...data, direccion: e.target.value})} className="form-input" />
        </div>

        {/* Horarios */}
        <div className="admin-card space-y-5">
          <h3 className="font-semibold text-amber-400 flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5" /> Horarios
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Lunes', key: 'horarioLunes' as const },
              { label: 'Martes', key: 'horarioMartes' as const },
              { label: 'Miércoles', key: 'horarioMiercoles' as const },
              { label: 'Jueves', key: 'horarioJueves' as const },
              { label: 'Viernes', key: 'horarioViernes' as const },
              { label: 'Sábado', key: 'horarioSabado' as const },
              { label: 'Domingo', key: 'horarioDomingo' as const },
            ].map(h => (
              <div key={h.key}>
                <label className="text-xs text-neutral-500 mb-1 block">{h.label}</label>
                <input placeholder="9:00-18:00" value={data[h.key]} onChange={e => setData({...data, [h.key]: e.target.value})} className="form-input py-2.5" />
              </div>
            ))}
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="admin-card space-y-5">
          <h3 className="font-semibold text-amber-400 flex items-center gap-2 text-lg">
            <Instagram className="w-5 h-5" /> Redes Sociales
          </h3>
          <input placeholder="Instagram (@usuario o URL)" value={data.instagram} onChange={e => setData({...data, instagram: e.target.value})} className="form-input" />
          <input placeholder="Facebook (URL)" value={data.facebook} onChange={e => setData({...data, facebook: e.target.value})} className="form-input" />
          <textarea placeholder="Mensaje de WhatsApp por defecto" value={data.mensajeWhatsapp} onChange={e => setData({...data, mensajeWhatsapp: e.target.value})} className="form-input resize-none" rows={3} />
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="mt-10 flex items-center gap-4">
        <button onClick={guardar} disabled={saving} className="btn-primary py-4 px-10 disabled:opacity-50">
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
        {saved && <span className="text-green-400 flex items-center gap-2"><Check className="w-5 h-5" /> Guardado correctamente</span>}
      </div>
    </div>
  );
}
