import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'filterTask'
})
export class FilterTaskPipe implements PipeTransform {

  dateFormatter(date: Date, format: string): any {
    if (!date) { return null; }
    return new DatePipe("en-US").transform(date, format);
  }

  transform(tasks: any[], searchTask: string, searchParent: string, from: number, to: number, sdate: Date, edate: Date): any {
    if (!tasks) return [];
    if (!searchTask && !searchParent && !from && !to && !sdate && !edate) return tasks;

    searchTask = searchTask ? searchTask.toLowerCase() : null;
    searchParent = searchParent ? searchParent.toLowerCase() : null;
    sdate = sdate ? new Date(this.dateFormatter(new Date(sdate), 'yyyy-MM-dd')) : null;
    edate = edate ? new Date(this.dateFormatter(new Date(edate), 'yyyy-MM-dd')) : null;

    return tasks.filter(task => {
      let o1 = true, o2 = true, o3 = true, o4 = true;
      task.startDate = new Date(this.dateFormatter(new Date(task.startDate), 'yyyy-MM-dd'));
      task.endDate = new Date(this.dateFormatter(new Date(task.endDate), 'yyyy-MM-dd'));
      if (searchTask) {
        o1 = task.task.toLowerCase().includes(searchTask)
      }

      if (searchParent && task.parentTaskId && task.parentTaskId['parentTask']) {
        o2 = task.parentTaskId['parentTask'].toLowerCase().includes(searchParent)
      }

      if (from && to) {
        o3 = +task.priority >= +from && +task.priority <= +to
      } else {
        if (from) {
          o3 = +task.priority >= +from
        } else if (to) {
          o3 = +task.priority <= +to
        }
      }

      if (sdate && edate) {
        o4 = task.startDate.getTime() >= sdate.getTime() && task.endDate.getTime() <= edate.getTime()
      } else {
        if (sdate != null) {
          o4 = task.startDate.getTime() >= sdate.getTime()
        } else if (edate != null) {
          o4 = task.endDate.getTime() <= edate.getTime()
        }
      }
      return (o1 && o2 && o3 && o4);
    });
  }

}