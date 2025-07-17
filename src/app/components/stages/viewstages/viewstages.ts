import { Component, OnInit } from '@angular/core';
import { StageService } from '../../../services/stage.service';

@Component({
  selector: 'app-viewstages',
  standalone: false,
  templateUrl: './viewstages.html',
  styleUrl: './viewstages.css'
})
export class Viewstages implements OnInit{
  stages!:any;

  constructor(
    private stageService: StageService
  ){}

  ngOnInit(): void {
    this.loadAllStages();
  }

  loadAllStages(): void{
    this.stages = this.stageService.loadAllStages();
  }
}
