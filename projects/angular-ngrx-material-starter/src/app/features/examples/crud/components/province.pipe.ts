import { Pipe, PipeTransform } from '@angular/core';

interface Area { code: string; geographic_level: string; name: string; }
@Pipe({name: 'province'})
export class ProvincePipe implements PipeTransform {
  transform(location: Area[]) {
      if(typeof location !== "undefined"){
        return location.filter(loc => loc.geographic_level === "Prov")
      }else{
          return [];
      }

  }
}

  @Pipe({name: 'municipal'})
  export class MunicipalPipe implements PipeTransform {
    transform(location: Area[], province?:string) {
        if(typeof location !== "undefined"){
          return location.filter(loc => loc.code === province &&
             loc.geographic_level != 'Prov' )
        }else{
            return [];
        }
  
    }
}
