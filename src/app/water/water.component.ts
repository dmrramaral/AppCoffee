import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Water } from '../../model/water';
import { ListWater } from '../../model/listWater';
import { Params } from '../../model/params';

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
  params: Params = { 
    alcalinityMin: 30,
    alcalinityMax: 50,
    durezaMin: 17,
    durezaMax: 85,
    phMin: 6.5,
    phMax: 7.5,
    sodiuMin: 5,
    sodiuMax: 15,
   };
  listWater: ListWater = { waterList: [] };
  formWater!: FormGroup;  
  formParams!: FormGroup;


  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.inicializeParams();
  }

  inicializeParams() {
    this.formParams = this.formBuilder.group({
      alcalinityMin: [this.params.alcalinityMin],
      alcalinityMax: [this.params.alcalinityMax],
      durezaMin: [this.params.durezaMin],
      durezaMax: [this.params.durezaMax],
      phMin: [this.params.phMin],
      phMax: [this.params.phMax],
      sodiuMin: [this.params.sodiuMin], 
      sodiuMax: [this.params.sodiuMax]
    });
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
      ph: [''],
      caracteristica: ['']
    }); 
  }

  calcular() {
    this.formWater.patchValue(this.calculateWaterProperties(this.formWater.value));
    this.save();
  }

  calculateWaterProperties(values: any) {
   
    const calculatedValues = {
      bicarbonato: values.bicarbonato,
      calcio: values.calcio,
      magnesio: values.magnesio,
      sodio: values.sodio,
      sulfato: values.sulfato,
      cloreto: values.cloreto,
      alcalinidade: values.bicarbonato * 0.8,
      dureza: values.calcio * 2.5 + values.magnesio * 4.2,
      ph: values.ph,
      caracteristica: this.gerarCaracteristicas(values)
    };

    this.formWater.patchValue({ caracteristica: calculatedValues.caracteristica });

    return calculatedValues;
  }

  gerarCaracteristicas(values: any) {
    let caracteristicas = [];

    if (values.bicarbonato >= 50) {
      caracteristicas.push("Água mais ácida");
    }
    if (values.bicarbonato < 50) {
      caracteristicas.push("Água menos ácida");
    }

    if (values.magnesio <= 3) {
      caracteristicas.push("menos frutado");
    }
    if (values.magnesio > 3) {
      caracteristicas.push("mais frutado");
    }

    if (values.calcio >= 16) {
      caracteristicas.push("mais doce.");
    }
    if (values.calcio < 16) {
      caracteristicas.push("menos doce.");
    }

   

    return caracteristicas.join(", ");
  }

  save() {
    console.log(this.formWater.value);
    this.listWater.waterList.push(this.formWater.value);
    this.formWater.reset();
  }

  saveParams() {
    console.log(this.params);
    this.params = this.formParams.value;


  }

  deleteWater(agua: Water) {
    this.listWater.waterList = this.listWater.waterList.filter(water => water !== agua);

    }
}
