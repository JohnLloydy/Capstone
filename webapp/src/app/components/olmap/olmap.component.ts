import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Renderer2,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { Feature, Map, View } from 'ol';
import { Draw, Modify, Snap, Select, Extent } from 'ol/interaction';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import ImageLayer from 'ol/layer/Image';
import { ZoomSlider, OverviewMap } from 'ol/control';
import { OSM, Vector as VectorSource, XYZ, ImageWMS } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import Projection from 'ol/proj/Projection';
import GeoJSON from 'ol/format/GeoJSON';
import Polygon from 'ol/geom/Polygon';
import LineString from 'ol/geom/LineString';
import Overlay from 'ol/Overlay';
import { getCenter } from 'ol/extent';

import { getArea } from 'ol/sphere';
import { Observable } from 'rxjs';

import { unByKey } from 'ol/Observable';
import Point from 'ol/geom/Point';
import { Geolocation } from '@capacitor/geolocation';

// const printCurrentPosition = async () => {
//   const coordinates = await Geolocation.getCurrentPosition();

//   console.log('Current position:', coordinates);
// };

@Component({
  selector: 'app-olmap',
  templateUrl: './olmap.component.html',
  styleUrls: ['./olmap.component.scss'],
})
export class OLMapComponent implements OnInit {
  place: any = [125.1244406,8.1571091];
  // place: any;
  coordinates : any;
  
  point: Point = new Point(this.place);

  map: Map | undefined;
  raster: any;
  source: any;
  vector: any;
  projection: Projection | undefined;
  basemap: any;
  maploaded = false;

  divmapid: any;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit() {
    setTimeout((_: any) => this.initMap(), 2000);
    // console.log(this.place);
    this.getcoordinates();
  }

  async getcoordinates (){
    const coords = await Geolocation.getCurrentPosition();
    const lat = coords.coords.latitude;
    const lon = coords.coords.longitude;
    this.place = [lon,lat];
    this.point = new Point([lon,lat]);
  }

  create_UUID() {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  }

  ngOnInit() {
    const divmap = this.renderer.createElement('div');
    this.renderer.addClass(divmap, 'map');
    this.divmapid = 'COVIDMAP' + this.create_UUID();
    this.renderer.setAttribute(divmap, 'id', this.divmapid);
    this.renderer.appendChild(this.el.nativeElement, divmap);

    const maplabelstyle = new Style({
      text: new Text({
        font: '12px Calibri,sans-serif',
        overflow: true,
        fill: new Fill({
          color: '#fff',
        }),
        stroke: new Stroke({
          color: '#000',
          width: 3,
        }),
      }),
    });
    const mapfillstyle = new Style({
      fill: new Fill({
        color: 'rgba(255, 0, 0)',
      }),
      stroke: new Stroke({
        color: '#fcf403',
        width: 1,
      }),
    });

    const mapstyle = [mapfillstyle, maplabelstyle];

    //base map
    this.basemap = new TileLayer({
      source: new XYZ({
        maxZoom: 17,
        attributions: 'Google Hybrid',
        url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
      }),
      // source: new OSM(),
    });

    // new VectorLayer({
    //   source: new VectorSource({
    //     features: [new Feature(point)],
    //   }),
     
    // });
    this.source = new VectorSource({
      features: [new Feature(this.point)],
    });
   
    // //muncity map
    // this.muncitysource = new VectorSource({
    //   format: new GeoJSON(),
    // });

    this.vector = new VectorLayer({
      declutter: true,
      source: this.source,
      style: {
        'circle-radius': 9,
        'circle-fill-color': 'red',
      },
    });

    // // add barangay boundaries
    // this.mapservice.MunicipalBdry().then(async (feature) => {
    //   await this.coviddatasvc.bukidnoncovid19_view_by_municipality_summary().then((items) => {
    //     items.map((a : any) => a.address_muncity).forEach((muncity:any) => {
    //       feature["features"] = feature["features"].map((fa:any) => {

    //         if (fa.properties["mun_city"] === "Malaybalay City"){
    //           fa.properties["mun_city"] = "CITY OF MALAYBALAY";
    //         } else if (fa.properties["mun_city"] === "Valencia City"){
    //           fa.properties["mun_city"] = "VALENCIA  CITY";
    //         } else if (fa.properties["mun_city"] === "Impasugong"){
    //           fa.properties["mun_city"] = "IMPASUG-ONG";
    //         }
    //         if (fa.properties["mun_city"].toUpperCase() === muncity.toUpperCase()) {
    //           const muncityfeature = items.find(
    //             (ma:any) => ma.address_muncity === muncity
    //           );
    //           fa.properties["totalactive"] = muncityfeature.totalactive;
    //           return fa;
    //         } else {

    //           return fa;
    //         }
    //       });
    //     });
    //   });
    //   await this.muncitysource.addFeatures(new GeoJSON().readFeatures(feature));
    //   await this.muncityvector.setStyle((feature:any, resolution:any) => {
    //     muncitylabelStyle
    //       .getText()
    //       .setText(
    //         feature.get("mun_city") + " - " + feature.get("totalactive")
    //       );

    //     if (feature.get("totalactive") === "0") {
    //       return muncitystylegreen;
    //     }
    //     return muncitystyle;
    //   });
    // });
  }

  initMap() {
    //draw map
    this.map = new Map({
      layers: [this.basemap,this.vector],
      target: this.divmapid,
      view: new View({
        zoom: 15,
        maxZoom: 20,
        center: this.place,
        projection: 'EPSG:4326',
      }),
    });
    // console.log(this.place);

    const zoomslider = new ZoomSlider();
    this.map.addControl(zoomslider);
    // this.map
    //   .getView()
    //   .fit([13784343.025655, 814368.207926, 14048821.648763, 978738.393527]);
    this.map.getView().setZoom(9);
  }
}
