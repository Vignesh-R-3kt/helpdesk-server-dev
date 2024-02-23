import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { UnauthorizedComponent } from '../../unauthorized/unauthorized.component';

@Component({
  selector: 'app-search-container',
  templateUrl: './search-container.component.html',
  styleUrls: ['./search-container.component.scss']
})
export class SearchContainerComponent implements OnInit {

  loading: boolean = false;
  emptyMessage: string = "Enter keywords to search";
  searchResults: any[] = [];
  myGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SearchContainerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private http: ApiService,
    private dialog: MatDialog
  ) {
    this.myGroup = this.fb.group({
      search: [""]
    });
  }

  ngOnInit(): void {
    this.myGroup.get('search')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchTerm: string) => {
        this.searchResults = [];
        if (searchTerm.length >= 3) {
          this.loading = true;
          return this.http.searchEmployeeList(searchTerm);
        } else {
          this.searchResults = [];
          this.emptyMessage = "Enter keywords to search";
          return [];
        }
      })
    ).subscribe((res: any) => {
      this.searchResults = res;
      this.loading = false;
      if (!res.length) {
        this.emptyMessage = "No results found."
      } else {
        this.emptyMessage = "Enter keywords to search";
      }
    }, (err: any) => {
      this.loading = false;
      if (err.status === 401) {
        this.dialog.open(UnauthorizedComponent, {
          disableClose: true,
          panelClass: 'unauthorized-popup'
        })
      }
    });
  }

  onCloseClick() {
    this.dialogRef.close();
  }

  clearInput() {
    this.myGroup.reset();
    this.searchResults = [];
    this.emptyMessage = "Enter keywords to search";
  }

  onKnowMoreClick(employee: any) {
    this.dialogRef.close(employee);
  }
}
