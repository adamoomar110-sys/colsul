import { Patient, Appointment, Budget } from '../types';

// Determinación inteligente de la ruta base del API
const getApiBase = (): string => {
  if (typeof window === 'undefined') return '/colsul/api';
  const path = window.location.pathname;
  if (path.includes('/colsul')) {
    return '/colsul/api';
  }
  return './api';
};

export interface SyncResult {
  success: boolean;
  message: string;
  saved?: {
    pacientes: number;
    turnos: number;
    presupuestos: number;
  };
  database?: string;
  error?: string;
}

export const apiService = {
  /**
   * Verifica la conexión a MySQL y crea las tablas si no existen
   */
  async setupDatabase(): Promise<any> {
    try {
      const res = await fetch(`${getApiBase()}/setup_db.php`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err: any) {
      console.warn('MySQL Ferozo no disponible localmente o error de red:', err.message);
      return { success: false, error: err.message };
    }
  },

  /**
   * Obtiene todos los pacientes desde MySQL
   */
  async getPatients(): Promise<Patient[] | null> {
    try {
      const res = await fetch(`${getApiBase()}/pacientes.php`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.success && Array.isArray(data.patients)) {
        return data.patients;
      }
      return null;
    } catch (err) {
      console.warn('Error al consultar pacientes desde MySQL, usando local:', err);
      return null;
    }
  },

  /**
   * Guarda o actualiza un paciente completo en MySQL (incluyendo fichas de especialidad, anamnesis y odontograma)
   */
  async savePatient(patient: Patient): Promise<boolean> {
    try {
      const res = await fetch(`${getApiBase()}/pacientes.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient)
      });
      const data = await res.json();
      return !!data.success;
    } catch (err) {
      console.warn('No se pudo guardar el paciente en MySQL:', err);
      return false;
    }
  },

  /**
   * Elimina un paciente de MySQL
   */
  async deletePatient(patientId: string): Promise<boolean> {
    try {
      const res = await fetch(`${getApiBase()}/pacientes.php?id=${encodeURIComponent(patientId)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      return !!data.success;
    } catch (err) {
      console.warn('No se pudo eliminar el paciente de MySQL:', err);
      return false;
    }
  },

  /**
   * Obtiene todos los turnos desde MySQL
   */
  async getAppointments(): Promise<Appointment[] | null> {
    try {
      const res = await fetch(`${getApiBase()}/turnos.php`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.success && Array.isArray(data.appointments)) {
        return data.appointments;
      }
      return null;
    } catch (err) {
      console.warn('Error al consultar turnos desde MySQL:', err);
      return null;
    }
  },

  /**
   * Guarda o actualiza un turno en MySQL
   */
  async saveAppointment(appointment: Appointment): Promise<boolean> {
    try {
      const res = await fetch(`${getApiBase()}/turnos.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment)
      });
      const data = await res.json();
      return !!data.success;
    } catch (err) {
      console.warn('No se pudo registrar el turno en MySQL:', err);
      return false;
    }
  },

  /**
   * Elimina un turno de MySQL
   */
  async deleteAppointment(appointmentId: string): Promise<boolean> {
    try {
      const res = await fetch(`${getApiBase()}/turnos.php?id=${encodeURIComponent(appointmentId)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      return !!data.success;
    } catch (err) {
      console.warn('No se pudo eliminar el turno de MySQL:', err);
      return false;
    }
  },

  /**
   * Guarda un estudio diagnóstico o radiografía en MySQL
   */
  async saveStudy(study: {
    id?: string;
    patientId: string;
    date: string;
    title: string;
    type?: string;
    imageUrl: string;
    notes?: string;
  }): Promise<boolean> {
    try {
      const res = await fetch(`${getApiBase()}/estudios.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(study)
      });
      const data = await res.json();
      return !!data.success;
    } catch (err) {
      console.warn('No se pudo registrar el estudio en MySQL:', err);
      return false;
    }
  },

  /**
   * Sincronización completa masiva hacia MySQL Ferozo
   */
  async syncAllToMySQL(patients: Patient[], appointments: Appointment[], budgets: Budget[]): Promise<SyncResult> {
    try {
      const res = await fetch(`${getApiBase()}/sync.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patients,
          appointments,
          budgets
        })
      });
      return await res.json();
    } catch (err: any) {
      return {
        success: false,
        message: 'Fallo al sincronizar con el servidor DonWeb',
        error: err.message
      };
    }
  },

  /**
   * Descarga todo el estado desde MySQL Ferozo
   */
  async fetchAllFromMySQL(): Promise<{
    patients: Patient[];
    appointments: Appointment[];
    budgets: Budget[];
  } | null> {
    try {
      const res = await fetch(`${getApiBase()}/sync.php`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.success) {
        return {
          patients: data.patients || [],
          appointments: data.appointments || [],
          budgets: data.budgets || []
        };
      }
      return null;
    } catch (err) {
      console.warn('No se pudo descargar la base completa desde MySQL:', err);
      return null;
    }
  },

  /**
   * Obtiene la lista de personas que se registraron al ingresar a la app (requiere credenciales de programador)
   */
  async getRegistros(user?: string, pass?: string): Promise<{ success: boolean; registros: AppAccessRecord[]; message?: string }> {
    try {
      const headers: Record<string, string> = {};
      if (user && pass) {
        headers['X-Admin-User'] = user;
        headers['X-Admin-Key'] = pass;
      }
      const res = await fetch(`${getApiBase()}/registro.php`, { headers });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.registros)) {
        return { success: true, registros: data.registros };
      }
      return { success: false, registros: [], message: data.message || 'Credenciales incorrectas' };
    } catch (err: any) {
      console.warn('Error al consultar registros de acceso:', err);
      return { success: false, registros: [], message: err.message };
    }
  },

  /**
   * Elimina un registro de acceso de la base de datos (requiere credenciales de programador)
   */
  async deleteRegistro(id: number, user?: string, pass?: string): Promise<boolean> {
    try {
      const headers: Record<string, string> = {};
      if (user && pass) {
        headers['X-Admin-User'] = user;
        headers['X-Admin-Key'] = pass;
      }
      const res = await fetch(`${getApiBase()}/registro.php?id=${id}`, {
        method: 'DELETE',
        headers
      });
      const data = await res.json();
      return !!data.success;
    } catch (err) {
      console.warn('Error al eliminar registro de acceso:', err);
      return false;
    }
  }
};

export interface AppAccessRecord {
  id: number;
  nombre: string;
  celular: string;
  usuario: string;
  fecha_registro: string;
}

