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
    alcalinityMin: 40,
    alcalinityMax: 75,
    durezaMin: 50,
    durezaMax: 175,
    phMin: 6.5,
    phMax: 7.5,
    sodiuMin: 7,
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
      alcalinidade: values.bicarbonato * 0.8202,
      dureza: values.calcio * 2.497 + values.magnesio * 4.118,
      ph: values.ph,
      caracteristica: this.gerarCaracteristicas(values)
    };

    this.formWater.patchValue({ caracteristica: calculatedValues.caracteristica });

    return calculatedValues;
  }

  gerarCaracteristicas(values: any) {
  let caracteristicas = [];

  // Ajuste para alcalinidade (baseado no parâmetro de alcalinidade)
  if (values.bicarbonato >= this.params.alcalinityMin && values.bicarbonato <= this.params.alcalinityMax) {
    caracteristicas.push("Água equilibrada em acidez");
  } /* else if (values.bicarbonato > this.params.alcalinityMax) {
    caracteristicas.push("Água menos ácida");
  } else {
    caracteristicas.push("Água mais ácida");
  } */

  /* // Ajuste para magnésio (baseado nos parâmetros de frutado)
  if ((values.calcio * 2.497 + values.magnesio * 4.118) <= this.params.durezaMin) {
    caracteristicas.push("menos frutado");
  } else {
    caracteristicas.push("mais frutado");
  } */

  // Ajuste para cálcio (baseado nos parâmetros de doçura)
  if ((values.calcio * 2.497 + values.magnesio * 4.118) >= this.params.durezaMin && (values.calcio * 2.497 + values.magnesio * 4.118) <= this.params.durezaMax) {
    caracteristicas.push("indicado pela SCA");
  } /* else {
    caracteristicas.push("menos doce");
  } */

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
