import {Component, Inject, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {SESSION_STORAGE, WebStorageService} from 'angular-webstorage-service';
import {Router} from '@angular/router';

/** Ключ для хранения данных в session storage */
const keyForSessionStorage = 'key';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent implements OnInit {
  myGroup: FormGroup;

  constructor(private fb: FormBuilder,
              @Inject(SESSION_STORAGE) private storage: WebStorageService,
              private router: Router) {
  }

  ngOnInit() {
    if (this.storage.get(keyForSessionStorage) !== null && this.storage.get(keyForSessionStorage) !== undefined) {
      this.router.navigate(['calendar']);
    }
    this.initForm();
  }

  onSubmit() {
    const controls = this.myGroup.controls;

    if (this.myGroup.invalid) {
      Object.keys(controls)
        .forEach(controlName => controls[controlName].markAsTouched());
      return;
    }
    this.saveDateInSessionStorage(keyForSessionStorage, this.myGroup.value.login + ' ' + this.myGroup.value.password);
    this.router.navigate(['calendar']);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.myGroup.controls[controlName];
    return control.invalid && control.touched;
  }

  private saveDateInSessionStorage(key, val): void {
    this.storage.set(key, val);
    this.myGroup[key] = this.storage.get(key);
  }

  private initForm() {
    this.myGroup = this.fb.group({
      login: ['', [
        Validators.required,
        Validators.pattern(/[^0-9](?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{3,16}/)
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]{5,10}$/)
      ]]
    });
  }
}
