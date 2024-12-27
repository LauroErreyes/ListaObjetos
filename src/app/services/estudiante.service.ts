// src/app/services/estudiante.service.ts
import { Injectable } from '@angular/core';
import { Estudiante } from '../models/estudiantes.model';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  private STORAGE_KEY = 'listaEstudiantes';

  // Lista de ejemplo
  estudiantes: Estudiante[] = [
    {
      cedula: '0101010101',
      nombres: 'Juan',
      apellidos: 'Pérez',
      sexo: 'M',
      fechaNacimiento: '1999-03-15',
      codigo: 'EST001',
      parcial1: 8,
      parcial2: 5,
      calificacionFinal: 6.5,
      examenRecuperacion: 8,
      notaDefinitiva: 7.4,
      estadoAprobatorio: 'Aprobado'
    },
    {
      cedula: '0202020202',
      nombres: 'Ana',
      apellidos: 'Gómez',
      sexo: 'F',
      fechaNacimiento: '2000-01-10',
      codigo: 'EST002',
      parcial1: 4,
      parcial2: 3,
      calificacionFinal: 3.5,
      estadoAprobatorio: 'Reprobado'
    },
    {
      cedula: '0303030303',
      nombres: 'Marco',
      apellidos: 'Torres',
      sexo: 'M',
      fechaNacimiento: '1998-07-21',
      codigo: 'EST003',
      parcial1: 6,
      parcial2: 5,
      calificacionFinal: 5.5,
      // Aun no se ha puesto la recuperación
      estadoAprobatorio: 'En recuperación'
    },
    {
      cedula: '0404040404',
      nombres: 'Laura',
      apellidos: 'Martínez',
      sexo: 'F',
      fechaNacimiento: '1997-11-12',
      codigo: 'EST004',
      parcial1: 9,
      parcial2: 7,
      calificacionFinal: 8,
      estadoAprobatorio: 'Aprobado'
    },
    {
      cedula: '0505050505',
      nombres: 'Carlos',
      apellidos: 'Hernández',
      sexo: 'M',
      fechaNacimiento: '2001-05-22',
      codigo: 'EST005',
      parcial1: 5,
      parcial2: 6,
      calificacionFinal: 5.5,
      examenRecuperacion: 6.5,
      notaDefinitiva: 6.2,
      estadoAprobatorio: 'En recuperación'
    },
    {
      cedula: '0606060606',
      nombres: 'Sofía',
      apellidos: 'González',
      sexo: 'F',
      fechaNacimiento: '1999-08-18',
      codigo: 'EST006',
      parcial1: 7,
      parcial2: 6,
      calificacionFinal: 6.5,
      estadoAprobatorio: 'Aprobado'
    }
  ];
  

  constructor() {
    this.cargarDesdeLocalStorage();
  }

  private cargarDesdeLocalStorage(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          this.estudiantes = parsed;
        }
      } catch (error) {
        console.error('Error al parsear localStorage:', error);
      }
    }
  }

  guardarEnLocalStorage(): void {
    try {
      const data = JSON.stringify(this.estudiantes);
      localStorage.setItem(this.STORAGE_KEY, data);
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }
}
