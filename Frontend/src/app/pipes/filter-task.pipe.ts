import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTask'
})
export class FilterTaskPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
