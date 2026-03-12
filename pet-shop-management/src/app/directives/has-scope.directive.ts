import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
    selector: '[appHasScope]'
})
export class HasScopeDirective implements OnInit, OnDestroy {
    private scopes: string[] = [];
    private destroy$ = new Subject<void>();

    @Input()
    set appHasScope(scope: string | string[]) {
        this.scopes = Array.isArray(scope) ? scope : [scope];
        this.updateView();
    }

    @Input()
    set appHasScopeOr(scopes: string[]) {
        this.scopes = scopes;
        this.updateView();
    }

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        // Observar mudanças no token/permissões
        this.authService.tokenPayload
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.updateView();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private updateView(): void {
        if (this.hasPermission()) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }

    private hasPermission(): boolean {
        return this.authService.hasAnyScope(this.scopes);
    }
}
