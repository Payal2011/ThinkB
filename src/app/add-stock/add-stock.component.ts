import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../inventory.service';

@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.css']
})
export class AddStockComponent implements OnInit {

  constructor(private service: InventoryService, private fb: FormBuilder) { }


  @Output() getPopUpStatus = new EventEmitter<boolean>();
  @Output() getSavedStatus = new EventEmitter<boolean>();



  newStock = new FormGroup({
    name: new FormControl('', [Validators.required]),
    desc: new FormControl(''),
    inventory: new FormControl(0, [Validators.required, Validators.min(0)]),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    active: new FormControl(1),
  })
  ngOnInit(): void {
  }

  closeAddPopUp() {
    this.getPopUpStatus.emit(false);
  }
  saveRecord(record) {

    var record = this.newStock.value;
    console.log(record)
    this.service.InserRecord(record).subscribe((data) => {
      if (data.status == "saved") {
        this.getSavedStatus.emit(true);
        this.getPopUpStatus.emit(false);
      }
      else {
        this.getSavedStatus.emit(false);
      }
    })

  }
}
