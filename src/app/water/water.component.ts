import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Water } from '../../model/water';
import { ListWater } from '../../model/listWater';

@Component({
  selector: 'app-water',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './water.component.html',
  styleUrls: ['./water.component.scss']
})
export class WaterComponent implements OnInit {

  water!: Water;
  listWater: ListWater = { waterList: [] };
  formWater!: FormGroup;  

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.formWater = this.formBuilder.group({
      nome: [''],
      bicarbonato: [''],
      calcio: [''],
      magnesio: [''],
      sodio: [''],
      sulfato: [''],
      cloreto: [''],
      alcalinidade: [''],
      dureza: [''],
      ph: ['']
    }); 
  }

  calcular() {
    const formValues = this.formWater.value;
    console.log(formValues);
    const updatedValues = this.calculateWaterProperties(formValues);
    this.formWater.patchValue(updatedValues);
    this.save();
  }

  calculateWaterProperties(values: any) {
    // Implement the calculation logic here
    // Example:
    return {
      bicarbonato: values.bicarbonato,
      calcio: values.calcio,
      magnesio: values.magnesio,
      sodio: values.sodio,
      sulfato: values.sulfato,
      cloreto: values.cloreto,
      alcalinidade: values.bicarbonato*0.8,
      dureza: (values.calcio*2.5)+(values.magnesio*4.2),
      ph: values.ph
    };
  }

  save() {
    this.listWater.waterList.push(this.formWater.value);
    this.formWater.reset();
  }
}
