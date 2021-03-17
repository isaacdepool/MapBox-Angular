import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
    .mapa-container{
      height: 100%;
      width: 100%;
    }

    .row{
      background-color: white;
      position: fixed;
      bottom: 50px;
      left: 50px;
      padding: 10px;
      radius: 5px;
      z-index: 999;
      width: 400px;
    }
    `
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLavel: number = 16;
  center: [number, number] = [ -71.686922, 10.605650];

  constructor() { }

  ngOnDestroy(): void {
    this.mapa.off('zoom', ()=>{});
    this.mapa.off('zoomend', ()=>{});
    this.mapa.off('move', ()=>{});
  }

  ngAfterViewInit(): void {
    
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLavel
    });

    // Zoom
    this.mapa.on('zoom', () =>{  
      
      const zoomActual =  this.mapa.getZoom();

      this.zoomLavel = zoomActual; 
    })

    this.mapa.on('zoomend', () =>{  
      
      if( this.mapa.getZoom() > 19 ){
        this.mapa.zoomTo(18);
      }
    })

    // Movimiento
    this.mapa.on('move', (event) => {

      const target = event.target;
      const {lng, lat} = target.getCenter();

      this.center = [lng, lat];
    })
  }

  zoom( zoom: string ){

    if(zoom === '+'){
      
      this.mapa.zoomIn();

    }else{
      this.mapa.zoomOut();

    } 
  }

  zoomCambio( valor: string){
    this.mapa.zoomTo( Number(valor) ); 
  }

}
