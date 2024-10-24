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
    this.formWater = this.formBuilder.group({
      nome: [null],
      bicarbonato: [null],
      calcio: [null],
      magnesio: [null],
      sodio: [null],
      sulfato: [null],
      cloreto: [null],
      alcalinidade: [null],
      dureza: [null],
      ph: [null]
    }); 
  }

  calcular() {
    console.log(this.formWater.value);
    const bicarbonato = this.formWater.get('bicarbonato')?.value || 0;

    const calcio = this.formWater.get('calcio')?.value || 0;
    const magnesio = this.formWater.get('magnesio')?.value || 0;
    const sodio = this.formWater.get('sodio')?.value || 0;
    const sulfato = this.formWater.get('sulfato')?.value || 0;
    const cloreto = this.formWater.get('cloreto')?.value || 0;
    const nome = this.formWater.get('nome')?.value || 0;
    const ph = this.formWater.get('ph')?.value || 0;
  
    const alcalinidade = bicarbonato * 0.8;
    const dureza = (calcio * 2.5) + (magnesio * 4.2);
  
    this.formWater.patchValue({
      alcalinidade: alcalinidade,
      dureza: dureza,
      sodio: sodio,
      sulfato: sulfato,
      cloreto: cloreto,
      nome: nome,
      ph: ph

    });
  
    this.save();
  }

  save() {
    this.listWater.waterList.push(this.formWater.value);
    this.formWater.reset();
  }
}
