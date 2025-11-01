import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification.service';
import { CustomValidators } from '../../validators/custom-validators';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro implements OnInit, OnDestroy {

  public registroForm!: FormGroup;
  public isLoading: boolean = false;
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  public step: number = 1; // Para registro en pasos
  public totalSteps: number = 3;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormValidation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.registroForm = this.fb.group({
      // Paso 1: Información personal
      nombre: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        CustomValidators.personName
      ]],
      apellido: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        CustomValidators.personName
      ]],
      fechaNacimiento: ['', [
        Validators.required,
        CustomValidators.dateOfBirth
      ]],
      
      // Paso 2: Información de contacto
      email: ['', [
        Validators.required,
        Validators.email,
        CustomValidators.email
      ]],
      telefono: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]],
      
      // Paso 3: Credenciales y preferencias
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        CustomValidators.strongPassword
      ]],
      confirmPassword: ['', [Validators.required]],
      aceptaTerminos: [false, [Validators.requiredTrue]],
      recibirPromociones: [true]
    }, {
      validators: [this.passwordMatchValidator]
    });
  }

  private setupFormValidation(): void {
    // Validación en tiempo real
    this.registroForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Lógica adicional si es necesaria
      });
  }

  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword?.hasError('passwordMismatch') && confirmPassword.errors) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }

  // Navegación entre pasos
  nextStep(): void {
    if (this.isStepValid()) {
      if (this.step < this.totalSteps) {
        this.step++;
      }
    } else {
      this.markStepFieldsAsTouched();
    }
  }

  prevStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  private isStepValid(): boolean {
    const fieldsToValidate = this.getFieldsForStep(this.step);
    return fieldsToValidate.every(field => {
      const control = this.registroForm.get(field);
      return control?.valid;
    });
  }

  private getFieldsForStep(step: number): string[] {
    switch (step) {
      case 1: return ['nombre', 'apellido', 'fechaNacimiento'];
      case 2: return ['email', 'telefono'];
      case 3: return ['password', 'confirmPassword', 'aceptaTerminos'];
      default: return [];
    }
  }

  private markStepFieldsAsTouched(): void {
    const fields = this.getFieldsForStep(this.step);
    fields.forEach(field => {
      this.registroForm.get(field)?.markAsTouched();
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async handleRegistro(): Promise<void> {
    // Validar todo el formulario
    this.registroForm.markAllAsTouched();

    if (this.registroForm.invalid) {
      this.notificationService.error(
        'Formulario incompleto',
        'Por favor complete todos los campos correctamente'
      );
      return;
    }

    this.isLoading = true;

    try {
      // Simular registro (en producción sería una llamada al backend)
      await this.simulateRegistration();

      const formData = this.registroForm.value;
      
      // Crear usuario
      const nuevoUsuario = {
        nombre: `${formData.nombre} ${formData.apellido}`,
        email: formData.email,
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento,
        recibirPromociones: formData.recibirPromociones,
        fechaRegistro: new Date().toISOString(),
        activo: true
      };

      // Auto-login después del registro
      const usuario = this.authService.login(nuevoUsuario.nombre, 'Cliente');

      if (usuario) {
        this.notificationService.success(
          '¡Bienvenido a Casa de Música!',
          'Tu cuenta ha sido creada exitosamente',
          { duration: 4000 }
        );

        // Redirigir a perfil
        setTimeout(() => {
          this.router.navigate(['/perfil']);
        }, 1500);
      }

    } catch (error) {
      console.error('Error en registro:', error);
      this.notificationService.error(
        'Error en el registro',
        'No se pudo crear tu cuenta. Intenta nuevamente.'
      );
    } finally {
      this.isLoading = false;
    }
  }

  private async simulateRegistration(): Promise<void> {
    // Simular latencia de red
    return new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
  }

  // Getters para facilitar acceso en template
  get nombre() { return this.registroForm.get('nombre'); }
  get apellido() { return this.registroForm.get('apellido'); }
  get fechaNacimiento() { return this.registroForm.get('fechaNacimiento'); }
  get email() { return this.registroForm.get('email'); }
  get telefono() { return this.registroForm.get('telefono'); }
  get password() { return this.registroForm.get('password'); }
  get confirmPassword() { return this.registroForm.get('confirmPassword'); }
  get aceptaTerminos() { return this.registroForm.get('aceptaTerminos'); }

  getErrorMessage(fieldName: string): string {
    const field = this.registroForm.get(fieldName);
    if (field?.errors && field.touched) {
      const errors = field.errors;
      
      if (errors['required']) return `Este campo es obligatorio`;
      if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
      if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
      if (errors['email']) return 'Email inválido';
      if (errors['pattern']) return 'Formato inválido (10 dígitos)';
      if (errors['personName']) return errors['personName'].message;
      if (errors['strongPassword']) return errors['strongPassword'].message;
      if (errors['dateOfBirth']) return errors['dateOfBirth'].message;
      if (errors['passwordMismatch']) return 'Las contraseñas no coinciden';
      if (errors['requiredTrue']) return 'Debes aceptar los términos y condiciones';
    }
    
    return '';
  }

  // Calcular progreso
  get progressPercentage(): number {
    return (this.step / this.totalSteps) * 100;
  }

  // Validadores para mostrar en template
  hasMinLength(): boolean {
    return this.password?.value?.length >= 8;
  }

  hasUppercase(): boolean {
    return this.password?.value && /[A-Z]/.test(this.password.value);
  }

  hasNumber(): boolean {
    return this.password?.value && /[0-9]/.test(this.password.value);
  }
}