import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';

describe('UserService', () => {
    let service: UserService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(UserService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add new user', () => {
        const initialCount = service.getUsers().length;
        service.addNewUser({
            idUser: 'test-id',
            nome: 'Teste',
            email: 'teste@petshop.com',
            senha: 'senha',
            perfilAcesso: service.getUsers()[0]?.perfilAcesso || 'gestão',
            status: service.getUsers()[0]?.status || 'ativo',
            cargo: 'Testador'
        } as any);
        expect(service.getUsers().length).toBe(initialCount + 1);
    });
});