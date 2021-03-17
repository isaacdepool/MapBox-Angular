import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor{
  color: string,
  marker?: mapboxgl.Marker,
  center?: [number, number]
}
@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
    .mapa-container{
      height: 100%;
      width: 100%;
    }

    .list-group{
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99;
    }

    li{
      cursor: pointer;
    }
    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLavel: number = 15;
  center: [number, number] = [ -71.686922, 10.605650];

  // Arreglo de marcadores 
  marcadores: MarcadorColor[] = [];

  constructor() { }

  ngAfterViewInit(): void {

     this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLavel
    });

    this.leerLocalStorage();


    // const markerHtml: HTMLElement = document.createElement('div');
    // markerHtml.innerHTML = 'hola mundo';

    // new mapboxgl.Marker({
    //   // element: markerHtml
    // })
    //   .setLngLat( this.center )
    //   .addTo( this.mapa )
  }

  irMarcador( marker: mapboxgl.Marker | undefined ){
        
    this.mapa.flyTo({
      center: marker?.getLngLat()
    })
  }

  agregarMarcador(){

    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));

    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color
    })
      .setLngLat( this.center )
      .addTo( this.mapa );

    this.marcadores.push({
      color,
      marker: nuevoMarcador
    });

    this.guardarMarcadores();

    nuevoMarcador.on('dragend', () =>{
      this.guardarMarcadores();
      
    })
  }
  
  guardarMarcadores(){

    const lngLatArr: MarcadorColor[] = [];

    this.marcadores.forEach( m => {
      const color = m.color;
      const { lng, lat } = m.marker?.getLngLat()!;

      lngLatArr.push({
        color,
        center: [lng,lat],
      });
    }) 
    
    localStorage.setItem('Mark', JSON.stringify(lngLatArr));
  }

  leerLocalStorage(){

    if( !localStorage.getItem('Mark') ){
      return;
    }

    const lngLatArr: MarcadorColor[] = JSON.parse( localStorage.getItem('Mark')! );

    lngLatArr.forEach( m => {


      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      })
      .setLngLat( m.center! )
      .addTo( this.mapa );

      this.marcadores.push({
        color: m.color,
        marker: newMarker
      })

      newMarker.on('dragend', () =>{
        this.guardarMarcadores();
        
      })
    })
  }

  borrarMarcador( idx: number ){
    this.marcadores[idx].marker?.remove();
    this.marcadores.splice(idx, 1);
    this.guardarMarcadores();
  }

}
