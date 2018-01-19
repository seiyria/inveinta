import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { CollectionType } from '../../models/CollectionTypes';

import * as _ from 'lodash';

@Component({
  styles: [`
    ion-textarea textarea {
      height: 100px;
    }
    
    .half-button {
      width: 18px;
      height: 18px;
      display: block;
    }
    
    .remove-button {
      height: 40px;
    }
  `],
  template: `
    <ion-header>

      <ion-navbar color="primary">
        <ion-buttons start>
          <button color="light" ion-button (click)="dismiss()">Close</button>
        </ion-buttons>
        <ion-title>{{ mode === 'add' ? 'Add New Mixin' : 'Edit Mixin' }}</ion-title>
      </ion-navbar>

    </ion-header>
    
    <ion-content padding>
      <ion-list>
        <ion-item>
          <ion-label stacked>Mixin Name</ion-label>
          <ion-input type="text" maxlength="20" placeholder="Mixin Name" [(ngModel)]="item.name"></ion-input>
        </ion-item>
        
        <ion-item>
          <ion-label stacked>Mixin Description</ion-label>
          <ion-textarea maxlength="100" placeholder="Mixin Description" [(ngModel)]="item.desc"></ion-textarea>
        </ion-item>
        
        <ion-grid *ngFor="let prop of item.props; let i = index">
          <ion-row>
            <ion-col col-5>
              <ion-item>
                <ion-label stacked>Property Name</ion-label>
                <ion-input type="text" maxlength="20" placeholder="Property Name" [(ngModel)]="prop.name"></ion-input>
              </ion-item>
            </ion-col>
            
            <ion-col col-4>
              <ion-item>
                <ion-label stacked>Property Type</ion-label>
                <ion-select [(ngModel)]="prop.type">
                  <ion-option *ngFor="let propType of mixinPropTypes" [value]="propType.type">{{ propType.name }}</ion-option>
                </ion-select>
              </ion-item>
            </ion-col>
            
            <ion-col col-3 true-center>
              <ion-row no-margin>
                <ion-col no-margin>
                  <button class="remove-button" ion-button color="danger" icon-only (click)="removeProp(i)">
                    <ion-icon name="close"></ion-icon>
                  </button>
                </ion-col>
                
                <ion-col no-margin>
                  <button class="half-button" ion-button color="secondary" icon-only (click)="moveUp(i)" 
                          [disabled]="i === 0">
                    <ion-icon name="arrow-dropup"></ion-icon>
                  </button>
                  <button class="half-button" ion-button color="secondary" icon-only (click)="moveDown(i)" 
                          [disabled]="i === item.props.length - 1">
                    <ion-icon name="arrow-dropdown"></ion-icon>
                  </button>
                </ion-col>
              </ion-row>
            </ion-col>
            
          </ion-row>
          
          <ion-row *ngIf="prop.type === 'computed'">
            <ion-col col-10>
              <ion-item>
                <ion-label stacked>Search Display</ion-label>
                <ion-input type="text" maxlength="20" placeholder="Search Display" [(ngModel)]="prop.computeDisplayString"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>

          <ion-row *ngIf="prop.type === 'computed'">
            <ion-col col-10>
              <ion-item>
                <ion-label stacked>Search Value (use {{ '{' }}name} to substitute item name in the URL)</ion-label>
                <ion-input type="text" maxlength="100" placeholder="Search Value" [(ngModel)]="prop.computeString"></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>

          <ion-row *ngIf="prop.type === 'choice'">
            <ion-col col-10>
              <ion-item>
                <ion-label stacked>Choices (separate choices with a semicolon ;)</ion-label>
                <ion-textarea maxlength="2000" placeholder="Mixin Choices" [(ngModel)]="prop.optionString"></ion-textarea>
              </ion-item>
            </ion-col>
          </ion-row>
          
        </ion-grid>
        
        <button ion-item color="secondary" icon-left (click)="addNewProp()">
          <ion-icon name="add"></ion-icon> Add New Property
        </button>
        
      </ion-list>
      
    </ion-content>
    
    <ion-footer>
      <ion-toolbar>
        <ion-buttons end>
          <button ion-button (click)="dismiss()">Cancel</button>
          <button ion-button (click)="submit(item)" color="primary" outline [disabled]="!canSubmit()">{{ mode === 'add' ? 'Add Mixin' : 'Edit Mixin' }}</button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  `
})
export class AddMixinModal implements OnInit {

  public item: CollectionType;

  public mixinPropTypes: Array<{ name: string, type: string, forceProp?: string, hidden?: boolean }> = [
    { name: 'Text',       type: 'string' },
    { name: 'Money',      type: 'money' },
    { name: 'Number',     type: 'number' },
    { name: 'Yes/No',     type: 'boolean' },
    { name: 'Checkbox',   type: 'inline-boolean' },
    { name: 'Choice',     type: 'choice' },
    { name: 'Rating',     type: 'rating' },
    { name: 'Long Text',  type: 'markdown', forceProp: 'descriptionMD', hidden: true },
    { name: 'Image',      type: 'imageURL', forceProp: 'imageURL', hidden: true },
    { name: 'Search URL', type: 'computed' }
  ];

  private mode: 'add'|'edit' = 'add';

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController
  ) {}

  ngOnInit() {
    this.item = this.navParams.get('item');

    if(this.item) {
      this.mode = 'edit';

    } else {
      this.item = { name: '', id: '', desc: '', props: [] };
    }
  }

  addNewProp(): void {
    this.item.props.push({
      name: '',
      prop: '',
      type: 'string'
    });
  }

  removeProp(index: number): void {
    this.item.props.splice(index, 1);
  }

  moveUp(index: number): void {
    const item = this.item.props[index];
    this.item.props.splice(index, 1);
    this.item.props.splice(index - 1, 0, item);
  }

  moveDown(index: number): void {
    const item = this.item.props[index];
    this.item.props.splice(index, 1);
    this.item.props.splice(index + 1, 0, item);
  }

  canSubmit(): boolean {
    return !!this.item.name.trim() && !!this.item.desc.trim() && this.isAPropValid();
  }

  private isPropValid(prop): boolean {
    if(prop.type === 'computed') {
      return prop.name && prop.computeDisplayString && prop.computeString;
    }

    if(prop.type === 'choice') {
      return prop.name && prop.optionString;
    }

    return prop.name;
  }

  private isAPropValid(): boolean {
    if(this.item.props.length === 0) return false;
    return _.some(this.item.props, prop => this.isPropValid(prop));
  }

  submit(item?: CollectionType) {
    if(!this.canSubmit()) return;

    if(item) {
      item.name = item.name.trim();
      item.desc = item.desc.trim();

      // generate an id if it doesn't have one
      if(!item.id) item.id = `CUSTOM-${_.camelCase(item.name)}`;

      // generate prop keys for each prop if they don't have one
      const removeProps = [];

      item.props.forEach((prop, i) => {
        if(!this.isPropValid(prop)) {
          removeProps.push(i);
          return;
        }

        if(prop.optionString) {
          prop.options = _.compact(prop.optionString.split(';').map(str => str.trim()));
        }

        if(prop.prop) return;

        const matchingProp = _.find(this.mixinPropTypes, { type: prop.type });

        if(matchingProp.hidden) prop.hidden = true;
        prop.prop = matchingProp.forceProp ? matchingProp.forceProp : `${_.camelCase(prop.name)}`;
      });

      // remove props with no name
      removeProps.forEach(index => {
        item.props.splice(index, 1);
      });
    }

    this.dismiss({ item, mode: this.mode });
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
}
