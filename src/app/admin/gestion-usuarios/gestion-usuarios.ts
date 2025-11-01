import { Component, inject, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../usuario.service';
import { NotificationService } from '../../services/notification.service';
import { CustomValidators } from '../../validators/custom-validators';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './gestion-usuarios.html',
  styleUrl: './gestion-usuarios.css',
})
export class GestionUsuarios implements OnInit { 

  public listaUsuarios: any[] = [];
  public usuarioForm!: FormGroup;
  public modalAbierto: boolean = false;
  public usuarioEditando: any = null;
  public isLoading: boolean = false;

  private usuarioService = inject(UsuarioService);
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.listaUsuarios = this.usuarioService.getUsuariosArray();
    this.initializeForm();
  }

  private initializeForm(): void {
    this.usuarioForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        CustomValidators.personName
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        CustomValidators.email
      ]],
      telefono: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]],
      rol: ['Cliente', [Validators.required]],
      activo: [true]
    });
  }

  abrirModal(usuario?: any): void {
    this.modalAbierto = true;
    this.usuarioEditando = usuario;
    
    if (usuario) {
      this.usuarioForm.patchValue(usuario);
    } else {
      this.usuarioForm.reset({
        rol: 'Cliente',
        activo: true
      });
    }
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.usuarioEditando = null;
    this.usuarioForm.reset();
  }

  async guardarUsuario(): Promise<void> {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      this.notificationService.error(
        'Formulario inválido',
        'Por favor corrija los errores antes de continuar'
      );
      return;
    }

    this.isLoading = true;

    try {
      const usuario = this.usuarioForm.value;
      
      if (this.usuarioEditando) {
        // Actualizar usuario existente
        usuario.id = this.usuarioEditando.id;
        const index = this.listaUsuarios.findIndex(u => u.id === usuario.id);
        if (index !== -1) {
          this.listaUsuarios[index] = { ...usuario };
        }
        this.notificationService.success(
          'Usuario actualizado',
          'Los cambios se guardaron correctamente'
        );
      } else {
        // Crear nuevo usuario
        usuario.id = this.listaUsuarios.length + 1;
        usuario.fechaRegistro = new Date().toISOString().split('T')[0];
        this.listaUsuarios.push(usuario);
        this.notificationService.success(
          'Usuario creado',
          'El usuario se agregó correctamente'
        );
      }

      this.cerrarModal();
    } catch (error) {
      this.notificationService.error(
        'Error',
        'No se pudo guardar el usuario'
      );
    } finally {
      this.isLoading = false;
    }
  }

  confirmarEliminar(usuario: any): void {
    if (confirm(`¿Está seguro de eliminar a ${usuario.nombre}?`)) {
      this.eliminarUsuario(usuario.id);
    }
  }

  eliminarUsuario(id: number): void {
    const index = this.listaUsuarios.findIndex(u => u.id === id);
    if (index !== -1) {
      const usuario = this.listaUsuarios[index];
      this.listaUsuarios.splice(index, 1);
      this.notificationService.success(
        'Usuario eliminado',
        `${usuario.nombre} fue removido del sistema`
      );
    }
  }

  toggleEstado(usuario: any): void {
    usuario.activo = !usuario.activo;
    this.notificationService.info(
      'Estado actualizado',
      `Usuario ${usuario.activo ? 'activado' : 'desactivado'}`
    );
  }

  // Getters para validaciones
  get nombre() { return this.usuarioForm.get('nombre'); }
  get email() { return this.usuarioForm.get('email'); }
  get telefono() { return this.usuarioForm.get('telefono'); }
  get rol() { return this.usuarioForm.get('rol'); }

  getErrorMessage(fieldName: string): string {
    const field = this.usuarioForm.get(fieldName);
    if (field?.errors && field.touched) {
      const errors = field.errors;
      
      if (errors['required']) return `${fieldName} es obligatorio`;
      if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
      if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
      if (errors['email']) return 'Email inválido';
      if (errors['pattern']) return 'Formato inválido';
      if (errors['personName']) return errors['personName'].message;
    }
    
    return '';
  }
}