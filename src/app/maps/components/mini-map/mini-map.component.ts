import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Map, Marker } from 'mapbox-gl';

@Component({
  selector: 'maps-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrl: './mini-map.component.css',
})
export class MiniMapComponent implements AfterViewInit {
  @ViewChild('map')
  public divMap?: ElementRef;

  @Input()
  lngLat?: [number, number];

  ngAfterViewInit(): void {
    if (!this.divMap?.nativeElement) throw new Error('Map HTML not found');
    if (!this.lngLat) throw Error("LngLat can't be null");

    const map = new Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLat, // starting position [lng, lat]
      zoom: 15, // starting zoom
      interactive: false,
    });

    new Marker().setLngLat(this.lngLat).addTo(map);
  }
}
