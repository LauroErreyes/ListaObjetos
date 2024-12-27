// src/app/components/estadisticas/estadisticas.component.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';

import { EstudianteService } from '../../services/estudiante.service';
import { Estudiante } from '../../models/estudiantes.model';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

  porcentajeAprobados = 0;
  porcentajeReprobados = 0;
  porcentajeAprobadosHombres = 0;
  porcentajeAprobadosMujeres = 0;
  promedioGeneral = 0;
  estudiantesSobrePromedio: Estudiante[] = [];

  constructor(
    private router: Router,
    public estudianteService: EstudianteService
  ) {}

  @ViewChild('aprobacionChart') aprobacionChart!: ElementRef;
  @ViewChild('generoChart') generoChart!: ElementRef;
  @ViewChild('promedioChart') promedioChart!: ElementRef;

  ngOnInit(): void {
    this.calcularEstadisticas();
  }

  calcularEstadisticas(): void {
    const lista = this.estudianteService.estudiantes;
    const total = lista.length;
    if (total === 0) {
      this.porcentajeAprobados = 0;
      this.porcentajeReprobados = 0;
      this.porcentajeAprobadosHombres = 0;
      this.porcentajeAprobadosMujeres = 0;
      this.promedioGeneral = 0;
      this.estudiantesSobrePromedio = [];
      return;
    }

    // (1) Porcentaje Aprobados / Reprobados
    const aprobados = lista.filter(e => e.estadoAprobatorio === 'Aprobado').length;
    const reprobados = lista.filter(e => e.estadoAprobatorio === 'Reprobado').length;
    // “En recuperación” no se cuenta como aprobado ni reprobado.
    this.porcentajeAprobados = (aprobados / total) * 100;
    this.porcentajeReprobados = (reprobados / total) * 100;

    // (2) Porcentaje de Aprobados Hombres/Mujeres
    const aprobHombres = lista.filter(e => e.estadoAprobatorio === 'Aprobado' && e.sexo === 'M').length;
    const aprobMujeres = lista.filter(e => e.estadoAprobatorio === 'Aprobado' && e.sexo === 'F').length;
    const totalHombres = lista.filter(e => e.sexo === 'M').length;
    const totalMujeres = lista.filter(e => e.sexo === 'F').length;

    this.porcentajeAprobadosHombres = (totalHombres === 0) 
      ? 0 
      : (aprobHombres / totalHombres) * 100;
    this.porcentajeAprobadosMujeres = (totalMujeres === 0)
      ? 0
      : (aprobMujeres / totalMujeres) * 100;

    const sum = lista.reduce((acc, e) => {
      const nota = (e.notaDefinitiva != null) ? e.notaDefinitiva : e.calificacionFinal;
      return acc + nota;
    }, 0);
    this.promedioGeneral = sum / total;

    // (4) Quienes superan ese promedio
    this.estudiantesSobrePromedio = lista.filter(e => {
      const nota = (e.notaDefinitiva != null) ? e.notaDefinitiva : e.calificacionFinal;
      return nota > this.promedioGeneral;
    });
  }

  volver(): void {
    this.router.navigate(['/estudiantes']);
  }
  
  ngAfterViewInit() {
    this.createAprobacionChart();
    this.createGeneroChart();
    this.createPromedioChart();
  }

  createAprobacionChart() {
    new Chart(this.aprobacionChart.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Aprobados', 'Reprobados'],
        datasets: [{
          data: [this.porcentajeAprobados, this.porcentajeReprobados],
          backgroundColor: ['#4CAF50', '#f44336']
        }]
      },
      options: {
        responsive: true,
        //maintainAspectRatio: false,  
        plugins: {
          legend: {
            position: 'bottom',
            }
        }
      }
    });
  }

  createGeneroChart() {
    new Chart(this.generoChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Hombres', 'Mujeres'],
        datasets: [{
          label: 'Porcentaje de Aprobados',
          data: [this.porcentajeAprobadosHombres, this.porcentajeAprobadosMujeres],
          backgroundColor: ['#2196F3', '#9C27B0']
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }

  createPromedioChart() {
    const value = this.promedioGeneral;
    const maxValue = 5; // Escala máxima
    const percentage = (value / maxValue) * 100;

    new Chart(this.promedioChart.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [percentage, 100 - percentage],
          backgroundColor: ['#3498db', '#f0f0f0'],
          circumference: 180, // Medio círculo
          rotation: 270
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: { enabled: false },
          legend: { display: false }
        },
        cutout: '75%'
      }
    });
}
}
