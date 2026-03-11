'use client';

import { useState, useEffect } from 'react';
import { 
  Phone, MessageCircle, Calendar, Clock, MapPin, Mail, 
  Instagram, Facebook, Scissors, X, ImageIcon, Check, 
  Menu, Trash2, Plus, Settings, LogOut, ChevronRight, Save, Upload
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
    <div className="min-h-screen bg-[#0c0c0c] text-white">
      {/* Navegación */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0c0c0c]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/10">
              {config?.logoUrl ? (
                <img src={config.logoUrl} alt="Logo" className="w-7 h-7 object-contain" />
              ) : (
                <Scissors className="w-6 h-6 text-black" />
              )}
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg tracking-tight">{config?.nombreNegocio || 'Barbería'}</span>
              <p className="text-xs text-amber-500">{config?.lema || 'Estilo Premium'}</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#servicios" className="text-sm text-neutral-400 hover:text-white transition-colors">Servicios</a>
            <a href="#galeria" className="text-sm text-neutral-400 hover:text-white transition-colors">Galería</a>
            <a href="#contacto" className="text-sm text-neutral-400 hover:text-white transition-colors">Contacto</a>
            <a href="#reservar" className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-lg shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:-translate-y-0.5">
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
          <div className="md:hidden bg-neutral-900/95 border-t border-white/5 px-6 py-4 space-y-3">
            <a href="#servicios" onClick={() => setMenuAbierto(false)} className="block py-2 text-neutral-300 hover:text-white">Servicios</a>
            <a href="#galeria" onClick={() => setMenuAbierto(false)} className="block py-2 text-neutral-300 hover:text-white">Galería</a>
            <a href="#contacto" onClick={() => setMenuAbierto(false)} className="block py-2 text-neutral-300 hover:text-white">Contacto</a>
            <a href="#reservar" onClick={() => setMenuAbierto(false)} className="block py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-lg text-center mt-4">Reservar Cita</a>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-8">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-sm text-amber-400">Abierto ahora</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {config?.nombreNegocio || 'Barbería Premium'}
          </h1>
          <p className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto">
            {config?.lema || 'Donde el estilo se encuentra con la elegancia. Profesionales dedicados a realzar tu imagen.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#reservar" className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-lg shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:-translate-y-1 inline-flex items-center justify-center gap-2">
              Agendar Cita <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <button onClick={whatsapp} className="px-8 py-4 border border-neutral-700 rounded-lg hover:bg-neutral-800/50 hover:border-neutral-600 transition-all inline-flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-500" /> WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="py-20 px-6 bg-gradient-to-b from-[#0c0c0c] via-neutral-900/50 to-[#0c0c0c]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Nuestros Servicios</h2>
            <p className="text-neutral-400">Servicios profesionales de barbería con productos premium</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicios.filter(s => s.activo).map(servicio => (
              <div key={servicio.id} className="group bg-neutral-900/50 rounded-2xl overflow-hidden border border-neutral-800 hover:border-amber-500/30 transition-all hover:-translate-y-1">
                <div className="h-44 bg-neutral-800 relative overflow-hidden">
                  {servicio.imagenUrl ? (
                    <img src={servicio.imagenUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                      <Scissors className="w-12 h-12 text-neutral-700" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{servicio.nombre}</h3>
                    <span className="text-amber-500 font-bold">${servicio.precio}</span>
                  </div>
                  <p className="text-neutral-400 text-sm mb-3">{servicio.descripcion || 'Servicio profesional de calidad'}</p>
                  <div className="flex items-center gap-2 text-neutral-500 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{servicio.duracion} minutos</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {servicios.filter(s => s.activo).length === 0 && (
            <div className="text-center py-16">
              <Scissors className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
              <p className="text-neutral-500">No hay servicios disponibles</p>
            </div>
          )}
        </div>
      </section>

      {/* Galería */}
      <section id="galeria" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Nuestros Trabajos</h2>
            <p className="text-neutral-400">Mira los estilos que hemos creado para nuestros clientes</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cortes.filter(c => c.activo).map(corte => (
              <div key={corte.id} className="group aspect-square bg-neutral-900 rounded-xl overflow-hidden relative border border-neutral-800 hover:border-amber-500/30 transition-all">
                {corte.imagenUrl ? (
                  <img src={corte.imagenUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                    <ImageIcon className="w-10 h-10 text-neutral-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div>
                    <span className="font-medium">{corte.titulo}</span>
                    {corte.descripcion && <p className="text-xs text-neutral-400">{corte.descripcion}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {cortes.filter(c => c.activo).length === 0 && (
            <div className="text-center py-16">
              <ImageIcon className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
              <p className="text-neutral-500">No hay trabajos en la galería</p>
            </div>
          )}
        </div>
      </section>

      {/* Reservar */}
      <section id="reservar" className="py-20 px-6 bg-gradient-to-b from-[#0c0c0c] via-neutral-900/50 to-[#0c0c0c]">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Agenda tu Cita</h2>
            <p className="text-neutral-400">Selecciona servicio, fecha y hora</p>
          </div>
          <FormCita servicios={servicios} />
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Contacto</h2>
            <p className="text-neutral-400">Estamos aquí para atenderte</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Info */}
            <div className="space-y-5">
              <div className="flex items-start gap-4 p-5 bg-neutral-900/50 rounded-xl border border-neutral-800">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Ubicación</h4>
                  <p className="text-neutral-400 text-sm">{config?.direccion || 'No configurada'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-neutral-900/50 rounded-xl border border-neutral-800">
                  <Phone className="w-5 h-5 text-amber-500 mb-3" />
                  <h4 className="font-semibold mb-1 text-sm">Teléfono</h4>
                  <p className="text-neutral-400 text-sm">{config?.telefono || 'No configurado'}</p>
                </div>
                <div className="p-5 bg-neutral-900/50 rounded-xl border border-neutral-800">
                  <Mail className="w-5 h-5 text-amber-500 mb-3" />
                  <h4 className="font-semibold mb-1 text-sm">Email</h4>
                  <p className="text-neutral-400 text-sm truncate">{config?.email || 'No configurado'}</p>
                </div>
              </div>

              <div className="p-5 bg-neutral-900/50 rounded-xl border border-neutral-800">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <h4 className="font-semibold">Horario</h4>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-neutral-500">Lun - Vie</span><span>{config?.horarioLunes || 'Cerrado'}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Sábado</span><span>{config?.horarioSabado || 'Cerrado'}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Domingo</span><span>{config?.horarioDomingo || 'Cerrado'}</span></div>
                </div>
              </div>
            </div>

            {/* Redes */}
            <div className="space-y-5">
              <div className="p-6 bg-neutral-900/50 rounded-xl border border-neutral-800 text-center">
                <h4 className="font-semibold mb-4">Síguenos</h4>
                <div className="flex justify-center gap-3">
                  {config?.instagram && (
                    <button onClick={() => window.open(config.instagram.startsWith('http') ? config.instagram : `https://instagram.com/${config.instagram}`, '_blank')} className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center hover:scale-105 transition-transform">
                      <Instagram className="w-5 h-5" />
                    </button>
                  )}
                  {config?.facebook && (
                    <button className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center hover:scale-105 transition-transform">
                      <Facebook className="w-5 h-5" />
                    </button>
                  )}
                  {config?.whatsapp && (
                    <button onClick={whatsapp} className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center hover:scale-105 transition-transform">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={whatsapp} className="p-5 bg-green-600 rounded-xl font-semibold flex flex-col items-center gap-2 hover:bg-green-500 transition-colors">
                  <MessageCircle className="w-6 h-6" />
                  <span>WhatsApp</span>
                </button>
                <a href="#reservar" className="p-5 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-xl font-semibold flex flex-col items-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all">
                  <Calendar className="w-6 h-6" />
                  <span>Reservar</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Scissors className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="font-semibold">{config?.nombreNegocio || 'Barbería'}</span>
              <p className="text-xs text-neutral-500">{config?.lema}</p>
            </div>
          </div>
          <p className="text-neutral-600 text-sm">© {new Date().getFullYear()} Todos los derechos reservados</p>
          <button onClick={() => setVista('login')} className="text-neutral-700 text-sm hover:text-amber-500 transition-colors">
            Panel Admin
          </button>
        </div>
      </footer>

      {/* WhatsApp flotante */}
      {config?.whatsapp && (
        <button onClick={whatsapp} className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 rounded-full shadow-lg shadow-green-600/30 flex items-center justify-center hover:scale-110 transition-transform z-50">
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

// ========== LOADING ==========
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
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
    <div className="bg-neutral-900/50 rounded-2xl p-10 text-center border border-neutral-800">
      <div className="w-20 h-20 rounded-full bg-green-600/20 flex items-center justify-center mx-auto mb-6">
        <Check className="w-10 h-10 text-green-500" />
      </div>
      <h3 className="text-2xl font-bold mb-2">¡Cita Agendada!</h3>
      <p className="text-neutral-400">Te esperamos en tu fecha programada</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="bg-neutral-900/50 rounded-2xl p-8 border border-neutral-800 space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <input required placeholder="Nombre completo *" value={data.clienteNombre} onChange={e => setData({...data, clienteNombre: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors" />
        <input required placeholder="Teléfono *" value={data.clienteTelefono} onChange={e => setData({...data, clienteTelefono: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors" />
      </div>
      <input placeholder="Email (opcional)" value={data.clienteEmail} onChange={e => setData({...data, clienteEmail: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors" />
      <select required value={data.servicioId} onChange={e => setData({...data, servicioId: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors">
        <option value="">Selecciona un servicio *</option>
        {servicios.filter(s => s.activo).map(s => <option key={s.id} value={s.id}>{s.nombre} - ${s.precio}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-4">
        <input type="date" required min={new Date().toISOString().split('T')[0]} value={data.fecha} onChange={e => setData({...data, fecha: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors" />
        <select required value={data.hora} onChange={e => setData({...data, hora: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors">
          <option value="">Hora *</option>
          {horas.map(h => <option key={h} value={h} disabled={ocupadas.includes(h)}>{h}</option>)}
        </select>
      </div>
      <textarea placeholder="Notas adicionales (opcional)" value={data.notas} onChange={e => setData({...data, notas: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors resize-none" rows={3} />
      <button disabled={loading} className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 disabled:opacity-50 transition-all">
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
    <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
            <Scissors className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold">Panel Admin</h1>
          <p className="text-neutral-500">{config?.nombreNegocio}</p>
        </div>
        <form onSubmit={submit} className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800 space-y-4">
          <input required placeholder="Usuario" value={user} onChange={e => setUser(e.target.value)} className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors" />
          <input type="password" required placeholder="Contraseña" value={pass} onChange={e => setPass(e.target.value)} className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors" />
          {err && <p className="text-red-400 text-sm text-center">{err}</p>}
          <button disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-xl shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all">
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
        <button onClick={() => setVista('publica')} className="w-full mt-4 text-neutral-500 text-sm hover:text-white transition-colors">
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
    <div className="min-h-screen bg-[#0c0c0c] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900/50 border-r border-neutral-800 p-5 hidden md:flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
            <Scissors className="w-5 h-5 text-black" />
          </div>
          <div>
            <p className="font-semibold">{config?.nombreNegocio}</p>
            <p className="text-xs text-neutral-500">Panel Admin</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setSeccion(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${seccion === item.id ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'}`}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-neutral-500 hover:text-red-400 rounded-xl transition-colors">
          <LogOut className="w-5 h-5" /> Cerrar sesión
        </button>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-neutral-900/95 border-b border-neutral-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold">{config?.nombreNegocio}</span>
          <button onClick={logout} className="text-neutral-500 hover:text-red-400"><LogOut className="w-5 h-5" /></button>
        </div>
        <div className="flex gap-2">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setSeccion(item.id)} className={`px-4 py-2 rounded-lg text-sm transition-all ${seccion === item.id ? 'bg-amber-500 text-black font-medium' : 'bg-neutral-800 text-neutral-400'}`}>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 p-8 pt-24 md:pt-8 overflow-auto">
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
      <h2 className="text-2xl font-bold mb-6">Gestión de Citas</h2>
      {citas.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/50 rounded-2xl border border-neutral-800">
          <Calendar className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
          <p className="text-neutral-500">No hay citas registradas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {citas.map(c => (
            <div key={c.id} className="bg-neutral-900/50 rounded-xl p-5 border border-neutral-800 hover:border-neutral-700 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold">{c.clienteNombre}</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${c.estado === 'confirmada' ? 'bg-green-600/20 text-green-500' : c.estado === 'cancelada' ? 'bg-red-600/20 text-red-500' : 'bg-amber-600/20 text-amber-500'}`}>
                      {c.estado}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400">{c.servicio?.nombre} • {c.fecha} a las {c.hora}</p>
                </div>
                <div className="flex items-center gap-3">
                  <select value={c.estado} onChange={async (e) => { await fetch(`/api/citas/${c.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado: e.target.value }) }); cargar(); }} className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm outline-none">
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                  <button onClick={async () => { if(confirm('¿Eliminar?')) { await fetch(`/api/citas/${c.id}`, { method: 'DELETE' }); cargar(); }}} className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
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

  const abrir = (s?: Servicio) => {
    if (s) { setEdit(s); setData({ nombre: s.nombre, precio: String(s.precio), duracion: String(s.duracion), descripcion: s.descripcion || '', imagenUrl: s.imagenUrl || '' }); }
    else { setEdit(null); setData({ nombre: '', precio: '', duracion: '', descripcion: '', imagenUrl: '' }); }
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
    await fetch(edit ? `/api/servicios/${edit.id}` : '/api/servicios', { method: edit ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, precio: Number(data.precio), duracion: Number(data.duracion) }) });
    setModal(false); cargar();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Servicios</h2>
        <button onClick={() => abrir()} className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 flex items-center gap-2 transition-all">
          <Plus className="w-4 h-4" /> Nuevo Servicio
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {servicios.map(s => (
          <div key={s.id} className={`bg-neutral-900/50 rounded-xl overflow-hidden border ${s.activo ? 'border-neutral-800 hover:border-neutral-700' : 'border-neutral-800 opacity-50'} transition-all`}>
            <div className="h-36 bg-neutral-800 relative">
              {s.imagenUrl ? <img src={s.imagenUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Scissors className="w-10 h-10 text-neutral-700" /></div>}
              {!s.activo && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-xs text-neutral-400">Inactivo</span></div>}
            </div>
            <div className="p-4">
              <div className="flex justify-between mb-1">
                <span className="font-semibold">{s.nombre}</span>
                <span className="text-amber-500 font-bold">${s.precio}</span>
              </div>
              <p className="text-xs text-neutral-500 mb-3">{s.duracion} minutos</p>
              <div className="flex gap-2">
                <button onClick={() => abrir(s)} className="flex-1 py-2 bg-neutral-800 rounded-lg text-sm hover:bg-neutral-700 transition-colors">Editar</button>
                <button onClick={async () => { await fetch(`/api/servicios/${s.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ activo: !s.activo }) }); cargar(); }} className={`px-3 py-2 rounded-lg text-sm transition-colors ${s.activo ? 'bg-green-600/20 text-green-500' : 'bg-red-600/20 text-red-500'}`}>
                  {s.activo ? 'On' : 'Off'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="w-full max-w-md bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">{edit ? 'Editar' : 'Nuevo'} Servicio</h3>
              <button onClick={() => setModal(false)} className="text-neutral-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {/* Upload de imagen */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-neutral-800 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  {data.imagenUrl ? <img src={data.imagenUrl} className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-neutral-600" />}
                </div>
                <label className="flex-1 cursor-pointer">
                  <div className="py-4 px-5 border-2 border-dashed border-neutral-700 rounded-xl text-center hover:border-amber-500/50 transition-colors">
                    <Upload className="w-5 h-5 mx-auto mb-2 text-neutral-500" />
                    <span className="text-sm text-neutral-400">Subir imagen</span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                </label>
              </div>
              <input placeholder="Nombre del servicio *" value={data.nombre} onChange={e => setData({...data, nombre: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Precio *" value={data.precio} onChange={e => setData({...data, precio: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors" />
                <input placeholder="Duración (min) *" value={data.duracion} onChange={e => setData({...data, duracion: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors" />
              </div>
              <textarea placeholder="Descripción" value={data.descripcion} onChange={e => setData({...data, descripcion: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors resize-none" rows={2} />
              <button onClick={guardar} className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-xl shadow-lg shadow-amber-500/20">Guardar</button>
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Galería</h2>
        <button onClick={() => abrir()} className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 flex items-center gap-2 transition-all">
          <Plus className="w-4 h-4" /> Nueva Imagen
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {cortes.map(c => (
          <div key={c.id} className={`bg-neutral-900/50 rounded-xl overflow-hidden border ${c.activo ? 'border-neutral-800 hover:border-neutral-700' : 'border-neutral-800 opacity-50'} transition-all`}>
            <div className="aspect-square bg-neutral-800 relative">
              {c.imagenUrl ? <img src={c.imagenUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-10 h-10 text-neutral-700" /></div>}
              {!c.activo && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-xs text-neutral-400">Inactivo</span></div>}
            </div>
            <div className="p-3">
              <p className="text-sm font-medium truncate mb-2">{c.titulo}</p>
              <div className="flex gap-1">
                <button onClick={() => abrir(c)} className="flex-1 py-2 bg-neutral-800 rounded-lg text-xs hover:bg-neutral-700 transition-colors">Editar</button>
                <button onClick={async () => { await fetch(`/api/cortes/${c.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ activo: !c.activo }) }); cargar(); }} className={`px-3 py-2 rounded-lg text-xs transition-colors ${c.activo ? 'bg-green-600/20 text-green-500' : 'bg-red-600/20 text-red-500'}`}>
                  {c.activo ? 'On' : 'Off'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="w-full max-w-md bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">{edit ? 'Editar' : 'Nueva'} Imagen</h3>
              <button onClick={() => setModal(false)} className="text-neutral-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {/* Upload de imagen */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-neutral-800 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  {data.imagenUrl ? <img src={data.imagenUrl} className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-neutral-600" />}
                </div>
                <label className="flex-1 cursor-pointer">
                  <div className="py-4 px-5 border-2 border-dashed border-neutral-700 rounded-xl text-center hover:border-amber-500/50 transition-colors">
                    <Upload className="w-5 h-5 mx-auto mb-2 text-neutral-500" />
                    <span className="text-sm text-neutral-400">Subir imagen</span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                </label>
              </div>
              <input placeholder="Título *" value={data.titulo} onChange={e => setData({...data, titulo: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors" />
              <textarea placeholder="Descripción" value={data.descripcion} onChange={e => setData({...data, descripcion: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors resize-none" rows={2} />
              <button onClick={guardar} className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-xl shadow-lg shadow-amber-500/20">Guardar</button>
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
      <h2 className="text-2xl font-bold mb-6">Configuración</h2>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Negocio */}
        <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800 space-y-5">
          <h3 className="font-semibold text-amber-500 flex items-center gap-2">
            <Scissors className="w-5 h-5" /> Información del Negocio
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-neutral-800 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
              {data.logoUrl ? <img src={data.logoUrl} className="w-full h-full object-contain" /> : <Scissors className="w-6 h-6 text-neutral-600" />}
            </div>
            <label className="flex-1 cursor-pointer">
              <div className="py-3 px-4 border-2 border-dashed border-neutral-700 rounded-xl text-center hover:border-amber-500/50 transition-colors">
                <Upload className="w-4 h-4 mx-auto mb-1 text-neutral-500" />
                <span className="text-xs text-neutral-400">Cambiar logo</span>
              </div>
              <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
            </label>
          </div>
          <input placeholder="Nombre del negocio" value={data.nombreNegocio} onChange={e => setData({...data, nombreNegocio: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors" />
          <input placeholder="Lema / Eslogan" value={data.lema} onChange={e => setData({...data, lema: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors" />
        </div>

        {/* Contacto */}
        <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800 space-y-5">
          <h3 className="font-semibold text-amber-500 flex items-center gap-2">
            <Phone className="w-5 h-5" /> Contacto
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Teléfono" value={data.telefono} onChange={e => setData({...data, telefono: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors text-sm" />
            <input placeholder="WhatsApp" value={data.whatsapp} onChange={e => setData({...data, whatsapp: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors text-sm" />
          </div>
          <input placeholder="Email" value={data.email} onChange={e => setData({...data, email: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors" />
          <input placeholder="Dirección" value={data.direccion} onChange={e => setData({...data, direccion: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors" />
        </div>

        {/* Horarios */}
        <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800 space-y-5">
          <h3 className="font-semibold text-amber-500 flex items-center gap-2">
            <Clock className="w-5 h-5" /> Horarios
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Lunes', key: 'horarioLunes' },
              { label: 'Martes', key: 'horarioMartes' },
              { label: 'Miércoles', key: 'horarioMiercoles' },
              { label: 'Jueves', key: 'horarioJueves' },
              { label: 'Viernes', key: 'horarioViernes' },
              { label: 'Sábado', key: 'horarioSabado' },
              { label: 'Domingo', key: 'horarioDomingo' },
            ].map(h => (
              <div key={h.key}>
                <label className="text-xs text-neutral-500">{h.label}</label>
                <input value={data[h.key as keyof typeof data] as string} onChange={e => setData({...data, [h.key]: e.target.value})} className="w-full px-3 py-2.5 bg-neutral-800/50 border border-neutral-700 rounded-lg focus:border-amber-500/50 outline-none transition-colors text-sm mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Redes */}
        <div className="bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800 space-y-5">
          <h3 className="font-semibold text-amber-500 flex items-center gap-2">
            <Instagram className="w-5 h-5" /> Redes Sociales
          </h3>
          <input placeholder="Instagram (@usuario o URL)" value={data.instagram} onChange={e => setData({...data, instagram: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors" />
          <input placeholder="Facebook (URL)" value={data.facebook} onChange={e => setData({...data, facebook: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors" />
          <textarea placeholder="Mensaje predefinido de WhatsApp" value={data.mensajeWhatsapp} onChange={e => setData({...data, mensajeWhatsapp: e.target.value})} className="w-full px-4 py-3.5 bg-neutral-800/50 border border-neutral-700 rounded-xl focus:border-amber-500/50 outline-none transition-colors resize-none" rows={2} />
        </div>
      </div>

      {/* BOTÓN GUARDAR */}
      <div className="mt-8 flex justify-end">
        <button onClick={guardar} disabled={saving} className={`px-10 py-4 font-semibold rounded-xl flex items-center gap-2 text-lg shadow-lg transition-all ${saved ? 'bg-green-600 text-white shadow-green-600/20' : 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-amber-500/20 hover:shadow-amber-500/30 hover:-translate-y-0.5'} disabled:opacity-50 disabled:hover:translate-y-0`}>
          {saving ? (
            <><div className="w-5 h-5 border-2 border-current/30 border-t-transparent rounded-full animate-spin" /> Guardando...</>
          ) : saved ? (
            <><Check className="w-5 h-5" /> ¡Guardado!</>
          ) : (
            <><Save className="w-5 h-5" /> Guardar Cambios</>
          )}
        </button>
      </div>
    </div>
  );
}
