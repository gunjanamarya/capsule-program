import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterParent'
})
export class FilterParentPipe implements PipeTransform {

  transform(parents: any[], searchText: string): any {
    if (!parents) return [];
    if (!searchText) return parents;
    searchText = searchText.toLowerCase();
    return parents.filter(parent => {
      return (parent.parentTask.toLowerCase().includes(searchText));
    });
  }
}