import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/Task.model';
import { TaskService } from '../../services/task.service';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css'],
  providers: [TaskService]
})
export class ViewTaskComponent implements OnInit {

  project: string;
  search_project: string;
  selected_project: string;
  tasks: Task[];

  constructor(private taskService: TaskService, private router: Router, private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // console.log('init called')
    // let id = this.route.snapshot.queryParamMap.get('projectId');
    // if (id) {
    //   this.getTasks(id);
    // }
  }

  saveProject() {
    let temp = this.selected_project.split('-')
    this.project = temp[1];
    this.getTasks(temp[0]);
    $('#ProjectModal').modal('hide');
    // this.router.navigate(['/view-task'], {
    //   queryParams: {
    //     projectId: temp[0]
    //   }
    // })
  }


  sort(basis) {
    if (basis == 'startDate') {
      this.tasks.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    } else if (basis == 'endDate') {
      this.tasks.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
    } else if (basis == 'Priority') {
      this.tasks.sort((a, b) => +a.priority - +b.priority)
    } else if (basis == 'Completed') {
      this.tasks = this.tasks.filter(task => task.status == 'completed')
    }
  }

  clearFilter() {
    let temp = this.selected_project.split('-')
    this.getTasks(temp[0]);
  }

  getTasks(id) {
    this.taskService.searchTask(id).subscribe(data => {
      this.tasks = data;
    }, error => {
      console.log(error)
    });
  }

  endTask(id) {
    this.taskService.setTaskAsComplete(id).subscribe(data => {
      this.clearFilter();
    });
  }

  editTask(id) {

  }

}