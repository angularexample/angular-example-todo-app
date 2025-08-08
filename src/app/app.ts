import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface MyTodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  httpClient: HttpClient = inject(HttpClient);
  changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected title = 'angular-example-todo-app';
  protected myTodoList: MyTodo[] = [];
  private readonly urlTodos: string = 'https://jsonplaceholder.typicode.com/todos';
  private selectedTodo: MyTodo | undefined;
  protected addTodoForm: FormGroup = new FormGroup({
    userId: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    completed: new FormControl(false)
  });
  protected deleteTodoForm: FormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
  });
  protected changeTodoForm: FormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
    userId: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    completed: new FormControl(false)
  });

  constructor() {
    this.getTodoList()
  }

  private getTodoList(): void {
    const url = `${this.urlTodos}?_limit=10`;
    this.httpClient.get(url).subscribe(data => {
      this.myTodoList = <MyTodo[]>data;
      this.changeDetectorRef.detectChanges();
    })
  }

  protected addTodo(): void {
    // Angular automatically serializes the object for the JSON body
    this.httpClient.post(this.urlTodos, this.addTodoForm.value).subscribe(data => {
      // Since the mock api does not ever change the get response,
      // We need to manually add the item to the list to see the updated list
      this.myTodoList.push(<MyTodo>data);
      // In the case of a real api we could just do the get
      // this.getTodoList();
      this.addTodoForm.reset();
      this.changeDetectorRef.detectChanges();
    })
  }

  protected deleteTodo(): void {
    const todoIdNumber: number = parseInt(this.deleteTodoForm.value.id);
    const url = `${this.urlTodos}/${this.deleteTodoForm.value.id}`;
    this.httpClient.delete(url).subscribe(() => {
      // Since the mock api does not ever change the get response,
      // We need to manually remove the item from the list to see the updated list
      this.myTodoList = this.myTodoList.filter(item => item.id !== todoIdNumber);
      // In the case of a real api we could just do the get
      // this.getTodoList();
      this.deleteTodoForm.reset();
      this.changeTodoForm.reset();
      this.changeDetectorRef.detectChanges();
    })
  }

  protected changeTodo(): void {
    const newTodo: MyTodo = this.changeTodoForm.value;
    const url = `${this.urlTodos}/${this.deleteTodoForm.value.id}`;
    // Angular automatically serializes the object for the JSON body
    this.httpClient.put(url, newTodo).subscribe(() => {
      // Since the mock api does not ever change the get response,
      // We need to manually update the item to see the updated list
      this.selectedTodo = this.myTodoList.find(item => item.id === newTodo.id);
      if (this.selectedTodo) {
        this.selectedTodo.userId = newTodo.userId;
        this.selectedTodo.title = newTodo.title;
        this.selectedTodo.completed = newTodo.completed;
      }
      // In the case of a real api we could just do the get
      // this.getTodoList();
      this.deleteTodoForm.reset();
      this.changeTodoForm.reset();
      this.changeDetectorRef.detectChanges();
    })
  }

  protected selectToDo(id: number) {
    this.selectedTodo = this.myTodoList.find(item => item.id === id);
    if (this.selectedTodo) {
      this.deleteTodoForm.patchValue(this.selectedTodo);
      this.changeTodoForm.patchValue(this.selectedTodo);
    }
  }
}
