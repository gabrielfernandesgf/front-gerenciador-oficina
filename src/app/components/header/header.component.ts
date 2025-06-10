import { Component, OnInit, Renderer2 } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MenubarModule,
    SelectButtonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  items: MenuItem[] | undefined;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.items = [
        {
          label: 'Home',
          icon: 'pi pi-home',
          routerLink: ['/home']
        },
        {
          label: 'Clientes',
          icon: 'pi pi-users',
          routerLink: ['/clientes']
        },
        {
            label: 'Marcas',
            icon: 'pi pi-plus',
            routerLink: ['/marcas']
        }
    ];
  }
}
