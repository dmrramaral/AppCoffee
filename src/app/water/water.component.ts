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
  
    // Cálculo da alcalinidade (baseado no parâmetro de alcalinidade da SCA)
    const alcalinidade = values.bicarbonato;
    if (alcalinidade >= this.params.alcalinityMin && alcalinidade <= this.params.alcalinityMax) {
      caracteristicas.push("Água equilibrada em acidez");
    } else if (alcalinidade > this.params.alcalinityMax) {
      caracteristicas.push("Água menos ácida, impacto reduzido na acidez");
    } else {
      caracteristicas.push("Água mais ácida, acidez acentuada");
    }
  
    // Cálculo da dureza total (com base em cálcio e magnésio)
    const durezaTotal = (values.calcio * 2.497) + (values.magnesio * 4.118);
  
    // Verificação da dureza para o perfil frutado/doce de acordo com a SCA
    if (durezaTotal >= this.params.durezaMin && durezaTotal <= this.params.durezaMax) {
      caracteristicas.push("Equilíbrio de corpo e doçura");
    } else if (durezaTotal > this.params.durezaMax) {
      caracteristicas.push("Possível sobre-extração, sabores amargos e metálicos");
    } else {
      caracteristicas.push("Sub-extração, sabor ralo e menos doce");
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
