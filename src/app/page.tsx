'use client';

import { useState, useEffect } from 'react';
import { 
  Phone, MessageCircle, Calendar, Clock, MapPin, Mail, 
  Instagram, Facebook, Scissors, X, ImageIcon, Check, 
  Menu, Trash2, Plus, Settings, LogOut, ChevronRight, Upload
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
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navegación */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo y Nombre */}
          <div className="flex items-center gap-3">
            {config?.logoUrl ? (
              <img src={config.logoUrl} alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-contain bg-neutral-900 p-1" />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <Scissors className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
              </div>
            )}
            <div>
              <h1 className="font-bold text-base sm:text-lg tracking-tight">{config?.nombreNegocio || 'Barbería'}</h1>
              {config?.lema && <p className="text-xs text-amber-400 hidden sm:block">{config.lema}</p>}
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#servicios" className="text-sm text-neutral-400 hover:text-white transition-colors">Servicios</a>
            <a href="#galeria" className="text-sm text-neutral-400 hover:text-white transition-colors">Galería</a>
            <a href="#contacto" className="text-sm text-neutral-400 hover:text-white transition-colors">Contacto</a>
            <a href="#reservar" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-colors">
              Reservar
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMenuAbierto(!menuAbierto)} className="md:hidden p-2 text-neutral-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuAbierto && (
          <div className="md:hidden bg-neutral-950 border-t border-white/10 px-6 py-4 space-y-3">
            <a href="#servicios" onClick={() => setMenuAbierto(false)} className="block py-2 text-neutral-300 hover:text-white">Servicios</a>
            <a href="#galeria" onClick={() => setMenuAbierto(false)} className="block py-2 text-neutral-300 hover:text-white">Galería</a>
            <a href="#contacto" onClick={() => setMenuAbierto(false)} className="block py-2 text-neutral-300 hover:text-white">Contacto</a>
            <a href="#reservar" onClick={() => setMenuAbierto(false)} className="block py-3 bg-amber-500 text-black font-semibold rounded-lg text-center mt-2">Reservar Cita</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 flex-1">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6 sm:mb-8">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-sm text-amber-400">Abierto ahora</span>
          </div>
          
          {/* Título Principal */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            {config?.nombreNegocio || 'Barbería Premium'}
          </h1>
          
          {/* Subtítulo */}
          <p className="text-base sm:text-lg text-neutral-400 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
            {config?.lema || 'Donde el estilo se encuentra con la elegancia. Profesionales dedicados a realzar tu imagen.'}
          </p>
          
          {/* Botones CTA */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <a href="#reservar" className="group px-6 sm:px-8 py-3.5 sm:py-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-all inline-flex items-center justify-center gap-2">
              Agendar Cita <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <button onClick={whatsapp} className="px-6 sm:px-8 py-3.5 sm:py-4 border border-neutral-700 hover:border-neutral-500 rounded-lg hover:bg-neutral-900 transition-all inline-flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-500" /> WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="py-16 sm:py-24 px-4 sm:px-6 bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">Nuestros Servicios</h2>
            <p className="text-neutral-400 text-sm sm:text-base">Servicios profesionales de barbería con productos premium</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {servicios.filter(s => s.activo).map(servicio => (
              <div key={servicio.id} className="group bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-amber-500/30 transition-all">
                <div className="h-40 sm:h-48 bg-neutral-800 relative overflow-hidden">
                  {servicio.imagenUrl ? (
                    <img src={servicio.imagenUrl} alt={servicio.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                      <Scissors className="w-12 h-12 text-neutral-700" />
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-base sm:text-lg">{servicio.nombre}</h3>
                    <span className="text-amber-400 font-bold text-base sm:text-lg">${servicio.precio}</span>
                  </div>
                  <p className="text-neutral-400 text-xs sm:text-sm mb-3 line-clamp-2">{servicio.descripcion || 'Servicio profesional de calidad'}</p>
                  <div className="flex items-center gap-2 text-neutral-500 text-xs sm:text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{servicio.duracion} minutos</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {servicios.filter(s => s.activo).length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <Scissors className="w-12 sm:w-16 h-12 sm:h-16 text-neutral-700 mx-auto mb-4" />
              <p className="text-neutral-500">No hay servicios disponibles</p>
            </div>
          )}
        </div>
      </section>

      {/* Galería */}
      <section id="galeria" className="py-16 sm:py-24 px-4 sm:px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">Nuestros Trabajos</h2>
            <p className="text-neutral-400 text-sm sm:text-base">Mira los estilos que hemos creado para nuestros clientes</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {cortes.filter(c => c.activo).map(corte => (
              <div key={corte.id} className="group aspect-square bg-neutral-900 rounded-xl overflow-hidden relative border border-neutral-800 hover:border-amber-500/30 transition-all">
                {corte.imagenUrl ? (
                  <img src={corte.imagenUrl} alt={corte.titulo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                    <ImageIcon className="w-8 sm:w-10 h-8 sm:h-10 text-neutral-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 sm:p-4">
                  <div>
                    <span className="font-medium text-sm">{corte.titulo}</span>
                    {corte.descripcion && <p className="text-xs text-neutral-400 hidden sm:block">{corte.descripcion}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {cortes.filter(c => c.activo).length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <ImageIcon className="w-12 sm:w-16 h-12 sm:h-16 text-neutral-700 mx-auto mb-4" />
              <p className="text-neutral-500">No hay trabajos en la galería</p>
            </div>
          )}
        </div>
      </section>

      {/* Reservar */}
      <section id="reservar" className="py-16 sm:py-24 px-4 sm:px-6 bg-neutral-950">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">Agenda tu Cita</h2>
            <p className="text-neutral-400 text-sm sm:text-base">Selecciona servicio, fecha y hora</p>
          </div>
          <FormCita servicios={servicios} />
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="py-16 sm:py-24 px-4 sm:px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">Contacto</h2>
            <p className="text-neutral-400 text-sm sm:text-base">Estamos aquí para atenderte</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-10">
            {/* Info */}
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-start gap-4 p-4 sm:p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">Ubicación</h4>
                  <p className="text-neutral-400 text-xs sm:text-sm">{config?.direccion || 'No configurada'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-4 sm:p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                  <Phone className="w-5 h-5 text-amber-400 mb-2 sm:mb-3" />
                  <h4 className="font-semibold mb-1 text-xs sm:text-sm">Teléfono</h4>
                  <p className="text-neutral-400 text-xs sm:text-sm">{config?.telefono || 'No configurado'}</p>
                </div>
                <div className="p-4 sm:p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                  <Mail className="w-5 h-5 text-amber-400 mb-2 sm:mb-3" />
                  <h4 className="font-semibold mb-1 text-xs sm:text-sm">Email</h4>
                  <p className="text-neutral-400 text-xs sm:text-sm truncate">{config?.email || 'No configurado'}</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-neutral-900 rounded-xl border border-neutral-800">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <h4 className="font-semibold text-sm sm:text-base">Horario</h4>
                </div>
                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="flex justify-between"><span className="text-neutral-500">Lun - Vie</span><span>{config?.horarioLunes || 'Cerrado'}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Sábado</span><span>{config?.horarioSabado || 'Cerrado'}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Domingo</span><span>{config?.horarioDomingo || 'Cerrado'}</span></div>
                </div>
              </div>
            </div>

            {/* Redes */}
            <div className="space-y-4 sm:space-y-5">
              <div className="p-5 sm:p-6 bg-neutral-900 rounded-xl border border-neutral-800 text-center">
                <h4 className="font-semibold mb-4 text-sm sm:text-base">Síguenos</h4>
                <div className="flex justify-center gap-3">
                  {config?.instagram && (
                    <button onClick={() => window.open(config.instagram.startsWith('http') ? config.instagram : `https://instagram.com/${config.instagram}`, '_blank')} className="w-11 sm:w-12 h-11 sm:h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center hover:scale-105 transition-transform">
                      <Instagram className="w-5 h-5" />
                    </button>
                  )}
                  {config?.facebook && (
                    <button className="w-11 sm:w-12 h-11 sm:h-12 rounded-xl bg-blue-600 flex items-center justify-center hover:scale-105 transition-transform">
                      <Facebook className="w-5 h-5" />
                    </button>
                  )}
                  {config?.whatsapp && (
                    <button onClick={whatsapp} className="w-11 sm:w-12 h-11 sm:h-12 rounded-xl bg-green-600 flex items-center justify-center hover:scale-105 transition-transform">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button onClick={whatsapp} className="p-4 sm:p-5 bg-green-600 hover:bg-green-500 rounded-xl font-semibold flex flex-col items-center gap-2 transition-colors text-sm sm:text-base">
                  <MessageCircle className="w-5 sm:w-6 h-5 sm:h-6" />
                  <span>WhatsApp</span>
                </button>
                <a href="#reservar" className="p-4 sm:p-5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-semibold flex flex-col items-center gap-2 transition-colors text-sm sm:text-base">
                  <Calendar className="w-5 sm:w-6 h-5 sm:h-6" />
                  <span>Reservar</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-6 sm:py-10 px-4 sm:px-6 bg-black mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {config?.logoUrl ? (
              <img src={config.logoUrl} alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-contain bg-neutral-900 p-1" />
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <Scissors className="w-4 sm:w-5 h-4 sm:h-5 text-black" />
              </div>
            )}
            <div>
              <span className="font-semibold text-sm sm:text-base">{config?.nombreNegocio || 'Barbería'}</span>
              {config?.lema && <p className="text-xs text-neutral-500">{config.lema}</p>}
            </div>
          </div>
          <p className="text-neutral-600 text-xs sm:text-sm">© {new Date().getFullYear()} Todos los derechos reservados</p>
          <button onClick={() => setVista('login')} className="text-neutral-700 text-xs sm:text-sm hover:text-amber-400 transition-colors">
            Panel Admin
          </button>
        </div>
      </footer>

      {/* WhatsApp flotante */}
      {config?.whatsapp && (
        <button onClick={whatsapp} className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 w-12 sm:w-14 h-12 sm:h-14 bg-green-600 hover:bg-green-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all z-50">
          <MessageCircle className="w-5 sm:w-6 h-5 sm:h-6" />
        </button>
      )}
    </div>
  );
}

// ========== LOADING ==========
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-10 sm:w-12 h-10 sm:h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
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
    <div className="bg-neutral-900 rounded-2xl p-6 sm:p-10 text-center border border-neutral-800">
      <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-green-600/20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
        <Check className="w-8 sm:w-10 h-8 sm:h-10 text-green-500" />
      </div>
      <h3 className="text-xl sm:text-2xl font-bold mb-2">¡Cita Agendada!</h3>
      <p className="text-neutral-400 text-sm sm:text-base">Te esperamos en tu fecha programada</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="bg-neutral-900 rounded-2xl p-5 sm:p-8 border border-neutral-800 space-y-4 sm:space-y-5">
      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
        <input required placeholder="Nombre completo *" value={data.clienteNombre} onChange={e => setData({...data, clienteNombre: e.target.value})} className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors text-sm sm:text-base" />
        <input required placeholder="Teléfono *" value={data.clienteTelefono} onChange={e => setData({...data, clienteTelefono: e.target.value})} className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors text-sm sm:text-base" />
      </div>
      <input placeholder="Email (opcional)" value={data.clienteEmail} onChange={e => setData({...data, clienteEmail: e.target.value})} className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors text-sm sm:text-base" />
      <select required value={data.servicioId} onChange={e => setData({...data, servicioId: e.target.value})} className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors text-sm sm:text-base">
        <option value="">Selecciona un servicio *</option>
        {servicios.filter(s => s.activo).map(s => <option key={s.id} value={s.id}>{s.nombre} - ${s.precio}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <input type="date" required min={new Date().toISOString().split('T')[0]} value={data.fecha} onChange={e => setData({...data, fecha: e.target.value})} className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors text-sm sm:text-base" />
        <select required value={data.hora} onChange={e => setData({...data, hora: e.target.value})} className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors text-sm sm:text-base">
          <option value="">Hora *</option>
          {horas.map(h => <option key={h} value={h} disabled={ocupadas.includes(h)}>{h}</option>)}
        </select>
      </div>
      <textarea placeholder="Notas adicionales (opcional)" value={data.notas} onChange={e => setData({...data, notas: e.target.value})} className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors resize-none text-sm sm:text-base" rows={3} />
      <button disabled={loading} className="w-full py-3.5 sm:py-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl disabled:opacity-50 transition-colors text-sm sm:text-base">
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Scissors className="w-7 sm:w-8 h-7 sm:h-8 text-black" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">Panel Admin</h1>
          <p className="text-neutral-500 text-sm">{config?.nombreNegocio}</p>
        </div>
        <form onSubmit={submit} className="bg-neutral-900 rounded-2xl p-5 sm:p-6 border border-neutral-800 space-y-4">
          <input required placeholder="Usuario" value={user} onChange={e => setUser(e.target.value)} className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors text-sm sm:text-base" />
          <input type="password" required placeholder="Contraseña" value={pass} onChange={e => setPass(e.target.value)} className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors text-sm sm:text-base" />
          {err && <p className="text-red-400 text-xs sm:text-sm text-center">{err}</p>}
          <button disabled={loading} className="w-full py-3 sm:py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl disabled:opacity-50 transition-colors text-sm sm:text-base">
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
        <button onClick={() => setVista('publica')} className="w-full mt-4 text-neutral-500 text-xs sm:text-sm hover:text-white transition-colors">
          ← Volver al inicio
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
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-950 border-r border-neutral-800 p-5 hidden md:flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          {config?.logoUrl ? (
            <img src={config.logoUrl} alt="Logo" className="w-10 h-10 rounded-xl object-contain bg-neutral-900 p-1" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Scissors className="w-5 h-5 text-black" />
            </div>
          )}
          <div>
            <p className="font-semibold text-sm">{config?.nombreNegocio}</p>
            <p className="text-xs text-neutral-500">Panel Admin</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setSeccion(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all text-sm ${seccion === item.id ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'}`}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-neutral-500 hover:text-red-400 rounded-xl transition-colors text-sm">
          <LogOut className="w-5 h-5" /> Cerrar sesión
        </button>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-neutral-950 border-b border-neutral-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-sm">{config?.nombreNegocio}</span>
          <button onClick={logout} className="text-neutral-500 hover:text-red-400"><LogOut className="w-5 h-5" /></button>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setSeccion(item.id)} className={`px-4 py-2 rounded-lg text-xs whitespace-nowrap transition-all ${seccion === item.id ? 'bg-amber-500 text-black font-medium' : 'bg-neutral-800 text-neutral-400'}`}>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 p-4 sm:p-8 pt-24 md:pt-8 overflow-auto">
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
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Gestión de Citas</h2>
      {citas.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-neutral-900 rounded-2xl border border-neutral-800">
          <Calendar className="w-12 sm:w-16 h-12 sm:h-16 text-neutral-700 mx-auto mb-4" />
          <p className="text-neutral-500 text-sm sm:text-base">No hay citas registradas</p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {citas.map(c => (
            <div key={c.id} className="bg-neutral-900 rounded-xl p-4 sm:p-5 border border-neutral-800 hover:border-neutral-700 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-1">
                    <span className="font-semibold text-sm sm:text-base">{c.clienteNombre}</span>
                    <span className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${c.estado === 'confirmada' ? 'bg-green-600/20 text-green-500' : c.estado === 'cancelada' ? 'bg-red-600/20 text-red-500' : 'bg-amber-600/20 text-amber-500'}`}>
                      {c.estado}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-400">{c.servicio?.nombre} • {c.fecha} a las {c.hora}</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <select value={c.estado} onChange={async (e) => { await fetch(`/api/citas/${c.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado: e.target.value }) }); cargar(); }} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-xs sm:text-sm outline-none">
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                  <button onClick={async () => { if(confirm('¿Eliminar?')) { await fetch(`/api/citas/${c.id}`, { method: 'DELETE' }); cargar(); }}} className="p-1.5 sm:p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
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
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Servicios</h2>
        <button onClick={() => abrir()} className="px-4 sm:px-5 py-2 sm:py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-xl flex items-center gap-2 transition-colors text-sm sm:text-base">
          <Plus className="w-4 h-4" /> Nuevo
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {servicios.map(s => (
          <div key={s.id} className={`bg-neutral-900 rounded-xl overflow-hidden border ${s.activo ? 'border-neutral-800 hover:border-neutral-700' : 'border-neutral-800 opacity-50'} transition-all`}>
            <div className="h-28 sm:h-36 bg-neutral-800 relative">
              {s.imagenUrl ? <img src={s.imagenUrl} alt={s.nombre} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Scissors className="w-8 sm:w-10 h-8 sm:h-10 text-neutral-700" /></div>}
              {!s.activo && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-xs text-neutral-400">Inactivo</span></div>}
            </div>
            <div className="p-3 sm:p-4">
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-sm sm:text-base">{s.nombre}</span>
                <span className="text-amber-400 font-bold text-sm sm:text-base">${s.precio}</span>
              </div>
              <p className="text-xs text-neutral-500 mb-2 sm:mb-3">{s.duracion} min</p>
              <div className="flex gap-2">
                <button onClick={() => abrir(s)} className="flex-1 py-1.5 sm:py-2 bg-neutral-800 rounded-lg text-xs sm:text-sm hover:bg-neutral-700 transition-colors">Editar</button>
                <button onClick={async () => { await fetch(`/api/servicios/${s.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ activo: !s.activo }) }); cargar(); }} className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors ${s.activo ? 'bg-green-600/20 text-green-500' : 'bg-red-600/20 text-red-500'}`}>
                  {s.activo ? 'On' : 'Off'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="w-full max-w-md bg-neutral-900 rounded-2xl p-5 sm:p-6 border border-neutral-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold">{edit ? 'Editar' : 'Nuevo'} Servicio</h3>
              <button onClick={() => setModal(false)} className="text-neutral-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {/* Preview + Upload */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-neutral-800 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-neutral-700">
                  {data.imagenUrl ? <img src={data.imagenUrl} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon className="w-6 sm:w-8 h-6 sm:h-8 text-neutral-600" />}
                </div>
                <label className="flex-1 cursor-pointer">
                  <div className={`py-2.5 sm:py-3 px-3 sm:px-4 border-2 border-dashed border-neutral-700 rounded-xl text-center hover:border-amber-500/50 transition-colors ${uploading ? 'opacity-50' : ''}`}>
                    <Upload className="w-4 sm:w-5 h-4 sm:h-5 mx-auto mb-1 text-neutral-500" />
                    <span className="text-xs text-neutral-400">{uploading ? 'Subiendo...' : 'Subir archivo'}</span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImage} className="hidden" disabled={uploading} />
                </label>
              </div>
              
              {/* URL Field */}
              <div className="relative">
                <input placeholder="O pega aquí la URL de la imagen" value={data.imagenUrl} onChange={e => setData({...data, imagenUrl: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors text-xs sm:text-sm pr-10" />
                {data.imagenUrl && (
                  <button type="button" onClick={() => setData({...data, imagenUrl: ''})} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-red-400">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <input placeholder="Nombre del servicio *" value={data.nombre} onChange={e => setData({...data, nombre: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors text-sm sm:text-base" />
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <input placeholder="Precio *" type="number" value={data.precio} onChange={e => setData({...data, precio: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors text-sm sm:text-base" />
                <input placeholder="Duración (min) *" type="number" value={data.duracion} onChange={e => setData({...data, duracion: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors text-sm sm:text-base" />
              </div>
              <textarea placeholder="Descripción" value={data.descripcion} onChange={e => setData({...data, descripcion: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors resize-none text-sm sm:text-base" rows={2} />
              <button onClick={guardar} className="w-full py-3 sm:py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-colors text-sm sm:text-base">Guardar</button>
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
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Galería</h2>
        <button onClick={() => abrir()} className="px-4 sm:px-5 py-2 sm:py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-xl flex items-center gap-2 transition-colors text-sm sm:text-base">
          <Plus className="w-4 h-4" /> Nueva
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {cortes.map(c => (
          <div key={c.id} className={`bg-neutral-900 rounded-xl overflow-hidden border ${c.activo ? 'border-neutral-800 hover:border-neutral-700' : 'border-neutral-800 opacity-50'} transition-all`}>
            <div className="aspect-square bg-neutral-800 relative">
              {c.imagenUrl ? <img src={c.imagenUrl} alt={c.titulo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-8 sm:w-10 h-8 sm:h-10 text-neutral-700" /></div>}
              {!c.activo && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-xs text-neutral-400">Inactivo</span></div>}
            </div>
            <div className="p-2 sm:p-3">
              <p className="text-xs sm:text-sm font-medium truncate mb-2">{c.titulo}</p>
              <div className="flex gap-1">
                <button onClick={() => abrir(c)} className="flex-1 py-1.5 sm:py-2 bg-neutral-800 rounded-lg text-xs hover:bg-neutral-700 transition-colors">Editar</button>
                <button onClick={async () => { await fetch(`/api/cortes/${c.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ activo: !c.activo }) }); cargar(); }} className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs transition-colors ${c.activo ? 'bg-green-600/20 text-green-500' : 'bg-red-600/20 text-red-500'}`}>
                  {c.activo ? 'On' : 'Off'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="w-full max-w-md bg-neutral-900 rounded-2xl p-5 sm:p-6 border border-neutral-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold">{edit ? 'Editar' : 'Nueva'} Imagen</h3>
              <button onClick={() => setModal(false)} className="text-neutral-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {/* Preview + Upload */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-neutral-800 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-neutral-700">
                  {data.imagenUrl ? <img src={data.imagenUrl} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon className="w-6 sm:w-8 h-6 sm:h-8 text-neutral-600" />}
                </div>
                <label className="flex-1 cursor-pointer">
                  <div className="py-2.5 sm:py-3 px-3 sm:px-4 border-2 border-dashed border-neutral-700 rounded-xl text-center hover:border-amber-500/50 transition-colors">
                    <Upload className="w-4 sm:w-5 h-4 sm:h-5 mx-auto mb-1 text-neutral-500" />
                    <span className="text-xs text-neutral-400">Subir archivo</span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                </label>
              </div>
              
              {/* URL Field */}
              <div className="relative">
                <input placeholder="O pega aquí la URL de la imagen" value={data.imagenUrl} onChange={e => setData({...data, imagenUrl: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors text-xs sm:text-sm pr-10" />
                {data.imagenUrl && (
                  <button type="button" onClick={() => setData({...data, imagenUrl: ''})} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-red-400">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <input placeholder="Título *" value={data.titulo} onChange={e => setData({...data, titulo: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors text-sm sm:text-base" />
              <textarea placeholder="Descripción" value={data.descripcion} onChange={e => setData({...data, descripcion: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors resize-none text-sm sm:text-base" rows={2} />
              <button onClick={guardar} className="w-full py-3 sm:py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-colors text-sm sm:text-base">Guardar</button>
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
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Configuración</h2>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Negocio */}
        <div className="bg-neutral-900 rounded-2xl p-4 sm:p-6 border border-neutral-800 space-y-4 sm:space-y-5">
          <h3 className="font-semibold text-amber-400 flex items-center gap-2 text-sm sm:text-base">
            <Scissors className="w-4 sm:w-5 h-4 sm:h-5" /> Información del Negocio
          </h3>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-neutral-800 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
              {data.logoUrl ? <img src={data.logoUrl} alt="Logo" className="w-full h-full object-contain" /> : <Scissors className="w-5 sm:w-6 h-5 sm:h-6 text-neutral-600" />}
            </div>
            <label className="flex-1 cursor-pointer">
              <div className="py-2.5 sm:py-3 px-3 sm:px-4 border-2 border-dashed border-neutral-700 rounded-xl text-center hover:border-amber-500/50 transition-colors">
                <Upload className="w-4 h-4 mx-auto mb-1 text-neutral-500" />
                <span className="text-xs text-neutral-400">Cambiar logo</span>
              </div>
              <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
            </label>
          </div>
          <input placeholder="Nombre del negocio" value={data.nombreNegocio} onChange={e => setData({...data, nombreNegocio: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors text-sm sm:text-base" />
          <input placeholder="Lema / Eslogan" value={data.lema} onChange={e => setData({...data, lema: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors text-sm sm:text-base" />
        </div>

        {/* Contacto */}
        <div className="bg-neutral-900 rounded-2xl p-4 sm:p-6 border border-neutral-800 space-y-4 sm:space-y-5">
          <h3 className="font-semibold text-amber-400 flex items-center gap-2 text-sm sm:text-base">
            <Phone className="w-4 sm:w-5 h-4 sm:h-5" /> Contacto
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <input placeholder="Teléfono" value={data.telefono} onChange={e => setData({...data, telefono: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors text-xs sm:text-sm" />
            <input placeholder="WhatsApp" value={data.whatsapp} onChange={e => setData({...data, whatsapp: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors text-xs sm:text-sm" />
          </div>
          <input placeholder="Email" value={data.email} onChange={e => setData({...data, email: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors text-sm sm:text-base" />
          <input placeholder="Dirección" value={data.direccion} onChange={e => setData({...data, direccion: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors text-sm sm:text-base" />
        </div>

        {/* Horarios */}
        <div className="bg-neutral-900 rounded-2xl p-4 sm:p-6 border border-neutral-800 space-y-4 sm:space-y-5">
          <h3 className="font-semibold text-amber-400 flex items-center gap-2 text-sm sm:text-base">
            <Clock className="w-4 sm:w-5 h-4 sm:h-5" /> Horarios
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
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
                <label className="text-xs text-neutral-500">{h.label}</label>
                <input placeholder="9:00-18:00" value={data[h.key]} onChange={e => setData({...data, [h.key]: e.target.value})} className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-neutral-800/50 border border-neutral-700 rounded-lg focus:border-amber-500/50 outline-none transition-colors text-xs sm:text-sm mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="bg-neutral-900 rounded-2xl p-4 sm:p-6 border border-neutral-800 space-y-4 sm:space-y-5">
          <h3 className="font-semibold text-amber-400 flex items-center gap-2 text-sm sm:text-base">
            <Instagram className="w-4 sm:w-5 h-4 sm:h-5" /> Redes Sociales
          </h3>
          <input placeholder="Instagram (@usuario o URL)" value={data.instagram} onChange={e => setData({...data, instagram: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors text-sm sm:text-base" />
          <input placeholder="Facebook (URL)" value={data.facebook} onChange={e => setData({...data, facebook: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors text-sm sm:text-base" />
          <textarea placeholder="Mensaje de WhatsApp por defecto" value={data.mensajeWhatsapp} onChange={e => setData({...data, mensajeWhatsapp: e.target.value})} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors resize-none text-sm sm:text-base" rows={2} />
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="mt-6 sm:mt-8 flex items-center gap-4">
        <button onClick={guardar} disabled={saving} className="px-6 sm:px-8 py-3 sm:py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl disabled:opacity-50 transition-colors text-sm sm:text-base">
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
        {saved && <span className="text-green-500 text-xs sm:text-sm">✓ Guardado correctamente</span>}
      </div>
    </div>
  );
}
