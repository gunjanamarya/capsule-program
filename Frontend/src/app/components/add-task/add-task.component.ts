import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { TitleCasePipe } from '@angular/common';
import { ParentTask } from '../../models/Task.model';
import { Task } from '../../models/Task.model';
declare var $: any;

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
  providers: [TaskService, TitleCasePipe]
})
export class AddTaskComponent implements OnInit {

  task_id: string;
  addTaskForm: FormGroup;
  today: Date;
  tomorrow: Date;
  parents_list: ParentTask[];
  search_parent: string;
  selected_parent: string;
  error: string;
  editable: boolean = false;

  constructor(private fb: FormBuilder,
    private taskService: TaskService,
    private titleCasePipe: TitleCasePipe,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.setDefaultDate()
    this.createForm();
    this.task_id = this.route.snapshot.queryParamMap.get('taskId');
    if (this.task_id) {
      this.editable = true;
      this.taskService.searchTask(this.task_id).subscribe(data => {
        // console.log(data)
        this.addTaskForm.setValue({
          task: data[0].task,
          priority: data[0].priority,
          ifParent: false,
          parentTask: data[0].parentTaskId ? data[0].parentTaskId['parentTask'] : null,
          startDate: this.dateFormatter(new Date(data[0].startDate), 'yyyy-MM-dd'),
          endDate: this.dateFormatter(new Date(data[0].endDate), 'yyyy-MM-dd'),
        })
        this.addTaskForm.get('ifParent').disable();
      })
    }
    this.getParentTasks();
  }

  getParentTasks() {
    this.taskService.getParents().subscribe(data => {
      // console.log(data);
      this.parents_list = data;
    }, error => {
      console.log(error)
    });
  }

  setDefaultDate() {
    let date1 = new Date();
    let date2 = new Date(date1.setDate(date1.getDate() + 1));
    this.today = this.dateFormatter(new Date(), 'yyyy-MM-dd');
    this.tomorrow = this.dateFormatter(date2, 'yyyy-MM-dd');
  }

  dateFormatter(date: Date, format: string): any {
    if (!date) { return null; }
    return new DatePipe("en-US").transform(date, format);
  }

  createForm() {
    this.addTaskForm = this.fb.group({
      task: [null, Validators.required],
      ifParent: false,
      priority: [0, Validators.required],
      parentTask: [{ value: null, disabled: true }],
      startDate: [this.today, Validators.required],
      endDate: [this.tomorrow, Validators.required],
    }, { validator: this.DateValidator() });
  }

  resetForm() {
    this.error = null;
    this.search_parent = null;
    this.selected_parent = null;
    this.editable = false;
    this.addTaskForm.reset({
      priority: 0,
      ifParent: false,
      startDate: this.today,
      endDate: this.tomorrow
    });
    this.addTaskForm.get('priority').enable();
    this.addTaskForm.get('startDate').enable();
    this.addTaskForm.get('endDate').enable();
    this.addTaskForm.get('ifParent').enable();
  }

  cancelEdit() {
    this.router.navigate(['./'])
  }

  DateValidator() {
    return (group: FormGroup): { [key: string]: any } => {
      let startDate = new Date(group.controls["startDate"].value);
      let endDate = new Date(group.controls["endDate"].value);
      let today = new Date(new DatePipe("en-US").transform(new Date(), 'yyyy-MM-dd'));
      if ((endDate.getTime() < startDate.getTime()) || (startDate.getTime() < today.getTime())) {
        return {
          dates: "Start/End date is incorrect"
        };
      }
      return {};
    }
  }

  saveParent() {
    let temp = this.selected_parent.split('-')
    this.addTaskForm.patchValue({
      "parentTask": temp[1].trim()
    });
    $('#ParentModal').modal('hide');
  }

  onAdd() {
    if (this.addTaskForm.get('ifParent').value) {
      // console.log('Parent task')
      var parentTask = new ParentTask();
      parentTask.parentTask = this.titleCasePipe.transform(this.addTaskForm.get('task').value);
      this.taskService.addParent(parentTask).subscribe(data => {
        this.resetForm();
        this.error = null;
        this.getParentTasks();
      }, error => {
        this.error = 'Atleast one of the field has error !!';
        console.log(error)
      })
    } else {
      // console.log('Child task')
      var subTask = new Task();
      subTask.parentTaskId = this.selected_parent ? this.selected_parent.split('-')[0].trim() : null;
      subTask.priority = this.addTaskForm.get('priority').value;
      subTask.startDate = this.addTaskForm.get('startDate').value;
      subTask.endDate = this.addTaskForm.get('endDate').value;
      subTask.task = this.titleCasePipe.transform(this.addTaskForm.get('task').value);
      this.taskService.addTask(subTask).subscribe(data => {
        this.resetForm();
        this.error = null;
      }, error => {
        this.error = 'Atleast one of the field has error !!';
        console.log(error)
      });
    }
  }

  onSelect(event) {
    if (event.target.checked) {
      this.addTaskForm.get('priority').disable();
      this.addTaskForm.get('startDate').disable();
      this.addTaskForm.get('endDate').disable();
    } else {
      this.addTaskForm.get('priority').enable();
      this.addTaskForm.get('startDate').enable();
      this.addTaskForm.get('endDate').enable();
    }
  }

  updateTask() {
    let subTask = new Task();
    subTask.parentTaskId = this.selected_parent ? this.selected_parent.split('-')[0].trim() : null;
    subTask.priority = this.addTaskForm.get('priority').value;
    subTask.startDate = this.addTaskForm.get('startDate').value;
    subTask.endDate = this.addTaskForm.get('endDate').value;
    subTask.task = this.titleCasePipe.transform(this.addTaskForm.get('task').value);

    this.taskService.editTask(this.task_id, subTask).subscribe(data => {
      this.resetForm();
      this.error = null;
    }, error => {
      this.error = 'Atleast one of the field has error !!';
      console.log(error)
    })
  }

}
