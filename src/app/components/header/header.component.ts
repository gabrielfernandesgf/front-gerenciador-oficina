import { Component, OnInit, Renderer2 } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MenubarModule,
    SelectButtonModule,
    FormsModule
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
          label: 'Ordem de serviço',
          icon: 'pi pi-list-check',
          routerLink: ['/ordensDeServico']
        },
        {
          label: 'Clientes',
          icon: 'pi pi-users',
          routerLink: ['/clientes']
        },
        {
            label: 'Veículos',
            icon: 'pi pi-car',
            routerLink: ['/veiculos']
        },
        {
            label: 'Marcas',
            icon: 'pi pi-crown',
            routerLink: ['/marcas']
        },
        {
            label: 'Modelos',
            icon: 'pi pi-objects-column',
            routerLink: ['/modelos']
        },
        // {
        //     label: 'Acessorios',
        //     icon: 'pi pi-hammer',
        //     routerLink: ['/acessorios']
        // },
        {
            label: 'Peças',
            icon: 'pi pi-cog',
            routerLink: ['/pecas']
        },
        {
            label: 'Serviços',
            icon: 'pi pi-wrench',
            routerLink: ['/servicos']
        },
        {
            label: 'Oficina',
            icon: 'pi pi-building',
            routerLink: ['/oficinas']
        },
        {
            label: 'Funcionario',
            icon: 'pi pi-id-card',
            routerLink: ['/funcionarios']
        }
    ];
  }
}
