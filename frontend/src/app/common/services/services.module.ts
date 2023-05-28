import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PocketbaseService } from './pocketbase.service';

@NgModule({
    declarations: [PocketbaseService],
    imports: [CommonModule],
})
export class ServicesModule {}
