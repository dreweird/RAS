import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { PmisService } from '../../core/services/pmis.service';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../core/core.module';


@Component({
  selector: 'anms-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {

  // @ViewChild('docSearchInput', { static: true }) movieSearchInput: ElementRef;
  apiResponse: any;
  isSearching: boolean;
  isNoResult: boolean;
  newSearch = '';

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;


  constructor(public recordService: PmisService, private cd: ChangeDetectorRef) {
    this.isSearching = false;
    this.isNoResult = false;
    this.apiResponse = [];
  }

  get isSearchDisabled() {
    return this.newSearch.length < 4;
  }

  onNewSearchChange(newSearch: string) {
    this.newSearch = newSearch;
  }

  onSearch(){
    this.isSearching = true;
    this.apiResponse  = [];
    this.recordService.searchDoc(this.newSearch).subscribe(data=> {
      if(data.result){
        this.isNoResult = false;
        this.apiResponse = data.data;
        console.log(data);
      }else{
        this.isNoResult = true;
      }
      this.isSearching = false;
      this.cd.markForCheck();
      })
  }
   


  ngOnInit() {}


}
