import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export interface MyTodo {
  completed: boolean;
  id: number;
  title: string;
  userId: number;
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
  changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  httpClient: HttpClient = inject(HttpClient);
  protected isChangeDisabled: boolean = true;
  protected myTodoList: MyTodo[] = [];
  private selectedTodo: MyTodo | undefined;
  protected title = 'angular-example-todo-app';
  private readonly urlTodos: string = 'https://jsonplaceholder.typicode.com/todos';
  protected addTodoForm: FormGroup = new FormGroup({
    userId: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    completed: new FormControl(false)
  });
  protected changeTodoForm: FormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
    userId: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    completed: new FormControl(false)
  });
  protected deleteTodoForm: FormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
  });

  constructor() {
    this.getTodoList();
    this.subscribeToFormChanges();
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

  protected selectToDo(id: number) {
    this.selectedTodo = this.myTodoList.find(item => item.id === id);
    if (this.selectedTodo) {
      this.deleteTodoForm.patchValue(this.selectedTodo);
      this.changeTodoForm.patchValue(this.selectedTodo);
    }
  }

  private areObjectsEqualAlphabetically(obj1:any, obj2: any): boolean {
    const keys1: string[] = Object.keys(obj1).sort();
    const keys2: string[] = Object.keys(obj2).sort();

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let i: number = 0; i < keys1.length; i++) {
      const key: string = keys1[i];
      if (key !== keys2[i]) { // Ensure keys are in the same order and are identical
        return false;
      }

      const val1: any = obj1[key];
      const val2: any = obj2[key];

      // Handle nested objects recursively
      if (typeof val1 === 'object' && val1 !== null && typeof val2 === 'object' && val2 !== null) {
        if (!this.areObjectsEqualAlphabetically(val1, val2)) {
          return false;
        }
      } else if (val1 !== val2) { // Compare primitive values
        return false;
      }
    }
    return true;
  }

  private getTodoList(): void {
    const url = `${this.urlTodos}?_limit=10`;
    this.httpClient.get(url).subscribe(data => {
      this.myTodoList = <MyTodo[]>data;
      this.changeDetectorRef.detectChanges();
    })
  }

  private isDifferent() {
    const newTodo: MyTodo = <MyTodo>this.changeTodoForm.value;
    const oldTodo: MyTodo | undefined = this.myTodoList.find(item => item.id === newTodo.id);
    let isDifferent: boolean = false;
    if (oldTodo) {
      isDifferent = !this.areObjectsEqualAlphabetically(oldTodo, newTodo);
    }
    return isDifferent;
  }

  private subscribeToFormChanges() {
    this.changeTodoForm.valueChanges.subscribe(() => {
      this.isChangeDisabled = !this.isDifferent() || this.changeTodoForm.invalid;
      this.changeDetectorRef.detectChanges();
    })
  }
}
