import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { UserTypeService } from 'src/app/services/user-type.service';


@Component({
  selector: 'app-search-container',
  templateUrl: './search-container.component.html',
  styleUrls: ['./search-container.component.scss']
})
export class SearchContainerComponent implements OnInit {

  loading: boolean = false;
  searchQuery: any;
  myGroup: FormGroup;
  emptyMessage: string = "Enter keywords to search";
  searchResults: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<SearchContainerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private http: ApiService,
  ) {
    this.myGroup = this.fb.group({
      search: [""]
    })
  }

  ngOnInit(): void {
  }

  onKnowMoreClick(employee: any) {
    this.dialogRef.close(employee);
  }

  onCloseClick() {
    this.dialogRef.close();
  }

  clearInput() {
    this.myGroup.reset();
    this.searchResults = [];
  }

  onSearch(event: any) {
    const searchTerm = event.target.value.trim().toLowerCase().replaceAll("#", "");

    if (searchTerm.length >= 3) {
      this.http.searchEmployeeList(searchTerm).subscribe((res: any) => {
        this.searchResults = res;
        if (!res.length) {
          this.emptyMessage = "No results found."
        }
      })
    } else {
      this.searchResults = [];
      this.emptyMessage = "Enter keywords to search";
    }
  }
}
