import { Component, OnInit, OnDestroy, Inject, Input, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldChinaHigh';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { any } from '@amcharts/amcharts5/.internal/core/util/Array';
import { DataService } from 'src/app/service/dataService';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
interface CsvData {
  id: string;
  Continent: string;
  Country: string;
  value: string;
  Number_of_immigrants: string;
  Proportion: string;

}
interface Food {
  value: string;
  viewValue: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent implements OnChanges {
  selectedYear: number = 2022;
  years: number[] = [2022, 2023];
  chart: any;
  //@Input() dataItem: any;
  dataSource: CsvData[] = [];
  displayedColumns: string[] = [

    'Country',
    //'value',
    'Number_of_immigrants',
    'Proportion', 'Year'];
 

  mapData: any;
  subscription: any;
  mapData$: any;
  selectedCar: number | undefined;

  cars = [
    { id: 1, name: 'Volvo' },
    { id: 2, name: 'Saab' },
    { id: 3, name: 'Opel' },
    { id: 4, name: 'Audi' },
  ];


  constructor(private cdr: ChangeDetectorRef, private dataService: DataService) {
    // this.refreshChangeDetection();

  }
  // refreshChangeDetection() {
  //   this.cdr.detectChanges();
  // }
  // ngOnChanges(changes: SimpleChanges): void {
  //   // Check if the input property has changed
  //   if (changes['dataItem']) {
  //     // this.ngOndestroy();
  //   //  this.reloadData();
  //     this.cdr.detectChanges();
  //   }
  // }
  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['dataItem']) {
    //   this.cdr.detectChanges(); // Trigger change detection
    // }
  }

  ngOnInit() {
   
 
    this.initializeChart();
    this.mapData$ = this.dataService.mapData$;
    this.subscription = this.mapData$.subscribe((data:any) => {
      this.mapData = data;
      if (this.mapData) {
        setTimeout(() => {
          this.reloadData(this.mapData);
        }, 200);
        
      
  }

    });
   
   // this.reloadData(this.mapData);
  }


  
  initializeChart() {
    console.log('check how many times it is calling');
   const chartdiv = document.getElementById('dialog');
    // Remove all child nodes from chartdiv
    if (chartdiv) {
      // Rest of your chart initialization code
      const root = am5.Root.new(chartdiv);
      root.setThemes([am5themes_Animated.new(root)]);
      this.chart = root.container.children.push(am5map.MapChart.new(root, {}));

      const polygonSeries = this.chart.series.push(
        am5map.MapPolygonSeries.new(this.chart.root, {
        //  include: this.getMap(),
         // geoJSON: am5geodata_worldLow,
          dx: 50,
          dy: -50
        })
      );
    //  this.reloadData(this.mapData);
    } else {
      console.error('Chart container element not found!');
    }
    this.chart.set("zoomLevel", 0.8);
    
  }

  getMap() {
    console.log('calling getMap');
    return [this.mapData?.dataContext?.id];
   // return [this.dataItem?.dataContext?.id];
  }


  // reloadData() {
  //   const include = [this.dataItem?.dataContext?.id];
  //   const newGeoJSONData = am5geodata_worldLow;/* Your updated GeoJSON data */;
  //   this.chart.series.each((series: { set: (arg0: string, arg1: any) => void; }) => {
  //     if (series instanceof am5map.MapPolygonSeries) {
  //       series.set("include", include);
  //       series.set("geoJSON", newGeoJSONData);
  //       series.set("dx", 70);
  //       series.set("dy", -70);

  //     }
  //   });
  //   this.dataSource = [
  //     {
  //       id: this.dataItem?.dataContext?.id,
  //       Continent: this.dataItem?.dataContext.Continent,
  //       Country: this.dataItem?.dataContext.name,
  //       value: this.dataItem?.dataContext.value,
  //       Number_of_immigrants: this.dataItem?.dataContext.Number_of_immigrants,
  //       Proportion: this.dataItem?.dataContext.Proportion
  //     }
  //   ];

  // }

  reloadData(dataItem: any) {
   // this.cdr.detectChanges();
   console.log('this.chart',this.chart);
   console.log('mapData',this.mapData);
    const include = [dataItem?.dataContext?.id];
    const newGeoJSONData = am5geodata_worldLow;
    if(this.chart)
    this.chart.series.each((series: { set: (arg0: string, arg1: any) => void; }) => {
      if (series instanceof am5map.MapPolygonSeries) {
        series.set("include", this.getMap());
        series.set("geoJSON", newGeoJSONData);
        series.set("dx", 70);
        series.set("dy", -70);
      }
    });
if(dataItem){
    this.dataSource = [
      {
        id: dataItem?.dataContext?.id,
        Continent: dataItem?.dataContext.Continent,
        Country: dataItem?.dataContext.name,
        value: dataItem?.dataContext.value,
        Number_of_immigrants: dataItem?.dataContext.Number_of_immigrants,
        Proportion: dataItem?.dataContext.Proportion
      }
    ];
   
  }
  this.cdr.detectChanges();
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
    // Add any additional cleanup logic if needed
  }


  // selectedRcpValue: string | null = null;
  // selectedIndicatorValue: string | null = null;
  // selectedNameValue: string | null = null;
  // selectedCountryValue: string | null = null;
  // selectRcp(value: string): void {
  //   this.selectedRcpValue = value;
  // }

  // selectIndicator(value: string): void {
  //   this.selectedIndicatorValue = value;
  // }
  // selectCountry(country: string): void {
  //   this.selectedCountryValue = country;

  // }
  // selectName(value: string): void {
  //   this.selectedNameValue = value;
  // }
}
