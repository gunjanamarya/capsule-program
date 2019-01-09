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
  searchTask: string;
  searchParent: string;
  from: number;
  to: number;
  sdate: Date;
  edate: Date;


  constructor(private taskService: TaskService, private router: Router, private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getTasks();
  }

  getTasks() {
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data;
    }, error => {
      console.log(error)
    });
  }

  endTask(id) {
    this.taskService.setTaskAsComplete(id).subscribe(data => {
      this.getTasks();
    });
  }

  editTask(id) {
    this.router.navigate(['/add-task'], {
      queryParams: {
        taskId: id
      }
    })
  }

}