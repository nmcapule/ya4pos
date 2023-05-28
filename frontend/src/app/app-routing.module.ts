import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'home',
        loadChildren: () =>
            import('./home-page/home-page.module').then(
                (m) => m.HomePageModule
            ),
    },
    {
        path: 'pos',
        loadChildren: () =>
            import('./pos-page/pos-page.module').then((m) => m.PosPageModule),
    },
    {
        path: 'account',
        loadChildren: () =>
            import('./account-page/account-page.module').then(
                (m) => m.AccountPageModule
            ),
    },
    {
        path: 'inventory',
        loadChildren: () =>
            import('./inventory-page/inventory-page.module').then(
                (m) => m.InventoryPageModule
            ),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
