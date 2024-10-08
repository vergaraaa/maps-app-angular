import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

interface MarkerAndColor {
  color: string;
  marker: Marker;
}

interface PlainMarker {
  color: string;
  lngLat: [number, number];
}

@Component({
  templateUrl: './markers-page.component.html',
  styleUrl: './markers-page.component.css',
})
export class MarkersPageComponent implements AfterViewInit {
  @ViewChild('map')
  public divMap?: ElementRef;

  public map?: Map;
  public currentCenter: LngLat = new LngLat(
    -74.08213790000212,
    4.643017390551975
  );

  public markers: MarkerAndColor[] = [];

  ngAfterViewInit(): void {
    if (!this.divMap) {
      throw new Error('HTML element was not found');
    }

    this.map = new Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.currentCenter,
      zoom: 13,
    });

    // const markerHTML = document.createElement('div');
    // markerHTML.innerHTML = 'Edgar Vergara';

    // const marker = new Marker({
    //   color: 'red',
    //   element: markerHTML,
    // })
    //   .setLngLat(this.currentCenter)
    //   .addTo(this.map);

    this.readFromLocalStorage();
  }

  createMarker() {
    if (!this.map) return;

    const lngLat = this.map.getCenter();
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    this.addMarker(lngLat, color);
  }

  addMarker(lngLat: LngLat, color: string = 'red') {
    if (!this.map) return;

    const marker = new Marker({
      color,
      draggable: true,
    })
      .setLngLat(lngLat)
      .addTo(this.map);

    marker.on('dragend', (e) => {
      this.saveToLocalStorage();
    });

    this.markers.push({ color, marker });
    this.saveToLocalStorage();
  }

  deleteMarker(i: number) {
    this.markers[i].marker.remove();
    this.markers.splice(i, 1);
    this.saveToLocalStorage();
  }

  flyTo(marker: Marker) {
    if (!this.map) return;

    this.map.flyTo({
      zoom: 14,
      center: marker.getLngLat(),
    });
  }

  saveToLocalStorage() {
    const plainMarkers: PlainMarker[] = this.markers.map(
      ({ color, marker }) => {
        return { color, lngLat: marker.getLngLat().toArray() };
      }
    );

    localStorage.setItem('plainMarkers', JSON.stringify(plainMarkers));
  }

  readFromLocalStorage() {
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers: PlainMarker[] = JSON.parse(plainMarkersString);

    plainMarkers.forEach(({ color, lngLat }) => {
      const [lng, lat] = lngLat;
      const coords = new LngLat(lng, lat);

      this.addMarker(coords, color);
    });
  }
}
