import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InventoryService } from '../inventory.service';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-view-stock',
  templateUrl: './view-stock.component.html',
  styleUrls: ['./view-stock.component.css']
})
export class ViewStockComponent implements OnInit {

  constructor(private fb: FormBuilder, private http: HttpClient, private service: InventoryService, private loader: NgxSpinnerService) { }

  @Input()
  getPopUpStatus: boolean = false;

  inventory: FormArray = this.fb.array([]);
  showsaveIcon = false;
  display;
  totalRecord;
  currentSearch = "";
  showAddPopUp = false;
  totalRows = []
  state = {
    'page': 1,
    'rows': 5,
  }
  querySet;
  searchable = ['name', 'desc', 'inventory', 'price']
  displayRecords(event) {
    this.state.rows = Number(event)
    this.buildTable(false);
  }

  ngOnInit(): void {

    this.loadData()
  }

  loadData() {
    this.service.getAllRecords().subscribe(data => {
      if (data) {
        this.querySet = data;
        this.inventory = this.buildTable(false)
      }
    })
  }

  pagination(querySet, page, rows) {
    var trimStart = (page - 1) * rows;
    var trimEnd = trimStart + rows
    var trimmedData = querySet.slice(trimStart, trimEnd)
    var pages = Math.ceil(querySet.length / rows);
    var range = (trimStart + 1) + " - " + trimEnd;

    if (this.state.page == pages) {
      range = (trimStart + 1) + "-" + querySet.length;
    }
    if (querySet.length == 0) {
      range = "0"
    }
    return {
      'querySet': trimmedData,
      'range': range,
      'result': querySet.length,
    }
  }

  search(filtereddata) {
    var searchResult = [];
    if (this.currentSearch == "") {
      searchResult = filtereddata;
    }
    else {

      for (var i = 0; i < filtereddata.length; i++) {
        for (var j = 0; j < this.searchable.length; j++) {
          if ((filtereddata[i][this.searchable[j]]) != null) {
            if (((filtereddata[i][this.searchable[j]]).toString().toLowerCase()).includes(this.currentSearch.toString().toLowerCase())) {
              searchResult.push(filtereddata[i]);
            }
          }
        }
      }
    }
    const uniqueSearch = Array.from(new Set(searchResult.map(a => a.id)))
      .map(id => {
        return searchResult.find(a => a.id === id)
      })
    return uniqueSearch;
  }

  buildFormData(data) {
    this.inventory = this.fb.array([]);
    (data as []).forEach(element => {
      this.inventory.push(
        this.fb.group({
          id: [element["id"]],
          name: [element["name"], Validators.required],
          desc: [element['desc']],
          inventory: [element['inventory'], [Validators.required, Validators.min(0)]],
          price: [element["price"], [Validators.required, Validators.min(0)]],
          active: [element["active"]],
        })
      )
    });
    return this.inventory;
  }

  buildTable(event) {

    var searchedData = this.search(this.querySet)
    var myData = this.pagination(searchedData, this.state.page, this.state.rows)
    var myList = myData.querySet;
    var formData = this.buildFormData(myList);
    this.hideShowPrev(this.state.page);
    this.hideShowNext(this.state.page, myData.result);

    this.display = myData.range
    this.totalRecord = myData.result;
    if (event) {
      this.download(searchedData)
    }
    return formData;
  }

  editRecord(event) {
    var makeEditable = event[2].cells;
    var index;
    $(event[1].children[1]).css('display', '')
    $(event[1].children[3]).removeClass('hide');
    $(event[1].children[2]).addClass('hide');
    for (index = 0; index < makeEditable.length - 1; index++) {
      console.log(makeEditable[index].children[0])
      $(makeEditable[index].children[0]).css('pointer-events', '')
      $(makeEditable[index].children[0]).removeAttr('disabled')
      $(makeEditable[index].children[0]).addClass('add-border')
    }
  }
  closeUpdate(event) {
    this.disbaleRecords(event)
  }
  disbaleRecords(event) {
    var makeEditable = event[2].cells;
    var index;
    $(event[1].children[1]).css('display', 'none')
    $(event[1].children[2]).removeClass('hide');
    $(event[1].children[3]).addClass('hide');
    for (index = 0; index < makeEditable.length - 1; index++) {
      $(makeEditable[index].children[0]).css('pointer-events', 'none')

      $(makeEditable[index].children[0]).removeClass('add-border')
    }
  }
  saveRecord(row, event) {
    this.loader.show()
    this.disbaleRecords(event)
    this.service.updateRecord(row).subscribe(data => {
      var status = data.status == "updated" ? true : false
      this.getRecordStatus(status)
    })
  }

  deleteRecord(row) {
    var r = confirm("Record will be deleted");
    if (r == true) {
      this.service.deleteRecord(row).subscribe((data): void => {
        var status = data.status == "deleted" ? true : false
        this.getRecordStatus(status)
      })
    } else {

    }

  }
  filter(value) {
    this.currentSearch = value;
    this.buildTable(false)
  }

  hideShowPrev(currentPage) {
    if (currentPage == 1) {
      $('#prev-arrow').addClass('no-event')
    }
    else {
      $('#prev-arrow').removeClass('no-event')
    }
  }
  hideShowNext(currentPage, results) {
    var totalPages = results / this.state.rows;
    if (totalPages <= currentPage) {
      $('#next-arrow').addClass('no-event')
    }
    else {
      $('#next-arrow').removeClass('no-event')
    }
  }
  prevRecord() {
    var currentPage = this.state.page;
    this.state.page = currentPage - 1;
    this.buildTable(false);
  }
  nextRecord() {
    var currentPage = this.state.page;
    this.state.page = currentPage + 1;
    this.buildTable(false);
  }


  addRecord() {
    this.showAddPopUp = true;
  }
  getPopUpStatusValue(value) {
    this.showAddPopUp = value;
  }
  getRecordStatus(value) {
    if (value) {
      this.loadData()
    }
  }

  download(data) {
    let csvData = this.ConvertToCSV(data);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv;charset=utf-8;'
    });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    navigator.userAgent.indexOf('Chrome') == -1;
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", "Inventory.csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }


  ConvertToCSV(objArray) {
    var array = objArray;
    var str = 'Id,Name,Price,Inventory,Active,CreatedOn,Desc' + '\r\n';
    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','

        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  }
}
