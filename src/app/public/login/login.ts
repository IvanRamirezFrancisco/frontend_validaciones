import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router'; 
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification.service';
import { CustomValidators } from '../../validators/custom-validators';
import { Subject, takeUntil, debounceTime } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ 
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule 
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit, OnDestroy {
  
  // Formulario reactivo
  public loginForm!: FormGroup;
  
  // Estados del componente
  public isLoading: boolean = false;
  public errorMessage: string = '';
  public showPassword: boolean = false;
  public loginAttempts: number = 0;
  public maxAttempts: number = 3;
  public isBlocked: boolean = false;
  public blockTimeRemaining: number = 0;

  // URL de retorno después del login
  private returnUrl: string = '';

  // Servicios inyectados
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  // Observable para cleanup
  private destroy$ = new Subject<void>();

  // Credenciales predefinidas para demo
  private readonly demoCredentials = {
    'admin': { password: 'admin123', role: 'Administrador' },
    'vendedor': { password: 'vend123', role: 'Vendedor' },
    'inventario': { password: 'inv123', role: 'Inventario' }
  };

  // Timer para bloqueo temporal
  private blockTimer?: any;

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormValidation();
    
    // Obtener URL de retorno de los query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    
    // Verificar si ya está autenticado
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.redirectAfterLogin(user);
        }
      });

    // Verificar si hay bloqueo temporal
    this.checkTemporaryBlock();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.blockTimer) {
      clearInterval(this.blockTimer);
    }
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      tipo: ['Cliente', [Validators.required]],
      nombre: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        CustomValidators.personName
      ]],
      contrasena: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]]
    });
  }

  private setupFormValidation(): void {
    // Escuchar cambios en el tipo de usuario
    this.loginForm.get('tipo')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(tipo => {
        this.onTipoChange(tipo);
      });

    // Validación en tiempo real con debounce
    this.loginForm.valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.clearError();
      });
  }

  private checkTemporaryBlock(): void {
    // Solo verificar bloqueo en el navegador
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    const blockData = localStorage.getItem('loginBlock');
    if (blockData) {
      const { timestamp, attempts } = JSON.parse(blockData);
      const blockDuration = 15 * 60 * 1000; // 15 minutos
      const timeElapsed = Date.now() - timestamp;
      
      if (timeElapsed < blockDuration && attempts >= this.maxAttempts) {
        this.isBlocked = true;
        this.blockTimeRemaining = Math.ceil((blockDuration - timeElapsed) / 1000);
        this.startBlockTimer();
      } else {
        // Limpiar bloqueo expirado
        localStorage.removeItem('loginBlock');
      }
    }
  }

  private startBlockTimer(): void {
    this.blockTimer = setInterval(() => {
      this.blockTimeRemaining--;
      if (this.blockTimeRemaining <= 0) {
        this.isBlocked = false;
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.removeItem('loginBlock');
        }
        clearInterval(this.blockTimer);
        this.notificationService.info(
          'Bloqueo liberado',
          'Ya puedes intentar iniciar sesión nuevamente'
        );
      }
    }, 1000);
  }

  private recordFailedAttempt(): void {
    this.loginAttempts++;
    
    if (this.loginAttempts >= this.maxAttempts) {
      this.isBlocked = true;
      this.blockTimeRemaining = 15 * 60; // 15 minutos
      
      // Solo guardar en localStorage si estamos en el navegador
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('loginBlock', JSON.stringify({
          timestamp: Date.now(),
          attempts: this.loginAttempts
        }));
      }
      
      this.startBlockTimer();
      
      this.notificationService.error(
        'Cuenta bloqueada temporalmente',
        `Demasiados intentos fallidos. Intente en ${this.blockTimeRemaining / 60} minutos.`
      );
    }
  }

  onTipoChange(tipo?: string): void {
    const tipoValue = tipo || this.loginForm.get('tipo')?.value;
    
    // Limpiar campos cuando cambia el tipo
    this.loginForm.patchValue({
      nombre: '',
      contrasena: ''
    });
    
    this.clearError();
    
    // Actualizar validadores según el tipo
    const nombreControl = this.loginForm.get('nombre');
    if (tipoValue === 'Empleado') {
      nombreControl?.setValidators([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        CustomValidators.username
      ]);
    } else {
      nombreControl?.setValidators([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        CustomValidators.personName
      ]);
    }
    nombreControl?.updateValueAndValidity();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  clearError(): void {
    this.errorMessage = '';
  }

  private validateCredentials(): boolean {
    const formValue = this.loginForm.value;
    
    if (formValue.tipo === 'Cliente') {
      // Para clientes, cualquier nombre y contraseña son válidos (demo)
      return true;
    } else {
      // ACCESO DEMO PARA PROFESOR - Cualquier usuario/contraseña es válido
      // Usuarios reconocidos con roles específicos
      const nombreLower = formValue.nombre.toLowerCase();
      const credentials = this.demoCredentials[nombreLower as keyof typeof this.demoCredentials];
      
      if (credentials) {
        // Usuario conocido con rol específico
        return true;
      } else {
        // Usuario desconocido - ACCESO COMO ADMINISTRADOR PARA DEMO
        console.log(`🎓 ACCESO DEMO: Usuario "${formValue.nombre}" accede como Administrador`);
        return true; // Permitir acceso para demostración al profesor
      }
    }
  }

  private async simulateApiCall(): Promise<void> {
    // Simular llamada API con delay realista
    return new Promise(resolve => {
      setTimeout(resolve, 800 + Math.random() * 1200);
    });
  }

  async handleLogin(): Promise<void> {
    // Verificar si está bloqueado
    if (this.isBlocked) {
      this.notificationService.warning(
        'Cuenta bloqueada',
        `Intente nuevamente en ${Math.ceil(this.blockTimeRemaining / 60)} minutos`
      );
      return;
    }

    // Marcar como touched para mostrar errores
    this.loginForm.markAllAsTouched();

    // Validar formulario
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, corrija los errores en el formulario';
      return;
    }

    // Validar credenciales
    if (!this.validateCredentials()) {
      this.recordFailedAttempt();
      return;
    }

    try {
      this.isLoading = true;
      this.clearError();

      // Simular llamada API
      await this.simulateApiCall();

      const formValue = this.loginForm.value;
      
      // Intentar login con lógica demo para profesor
      let usuario;
      
      if (formValue.tipo === 'Cliente') {
        usuario = this.authService.login(formValue.nombre, formValue.tipo);
      } else {
        // Para empleados, determinar rol automáticamente
        const nombreLower = formValue.nombre.toLowerCase();
        const knownUser = this.demoCredentials[nombreLower as keyof typeof this.demoCredentials];
        
        if (knownUser) {
          // Usuario conocido - usar su rol específico
          usuario = this.authService.loginWithRole(formValue.nombre, knownUser.role as any);
        } else {
          // Usuario desconocido - ACCESO DEMO COMO ADMINISTRADOR
          usuario = this.authService.loginWithRole(formValue.nombre, 'Administrador' as any);
          console.log(`🎓 DEMO: ${formValue.nombre} accede como Administrador para revisión`);
        }
      }

      if (!usuario) {
        throw new Error('Error interno del sistema');
      }

      // Reset intentos fallidos
      this.loginAttempts = 0;
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.removeItem('loginBlock');
      }

      // Mostrar notificación de éxito
      this.notificationService.success(
        '¡Bienvenido!', 
        `Sesión iniciada como ${usuario.rol}`,
        { duration: 3000 }
      );

      // Redirigir según rol
      this.redirectAfterLogin(usuario);

    } catch (error) {
      console.error('Error en login:', error);
      this.errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      this.recordFailedAttempt();
      
      // Mostrar notificación de error
      this.notificationService.error(
        'Error de autenticación',
        this.errorMessage
      );
    } finally {
      this.isLoading = false;
    }
  }

  private redirectAfterLogin(usuario: any): void {
    let targetUrl = '';

    // Si hay URL de retorno, usar esa
    if (this.returnUrl) {
      targetUrl = this.returnUrl;
    } else {
      // Redirigir según rol
      switch (usuario.rol) {
        case 'Cliente':
          targetUrl = '/';
          break;
        case 'Administrador':
          targetUrl = '/admin/dashboard';
          break;
        case 'Vendedor':
          targetUrl = '/admin/punto-de-venta';
          break;
        case 'Inventario':
          targetUrl = '/admin/inventario';
          break;
        default:
          targetUrl = '/';
      }
    }

    // Pequeño delay para UX
    setTimeout(() => {
      this.router.navigate([targetUrl]);
    }, 800);
  }

  // Métodos de conveniencia para demo
  fillDemoCredentials(username: string): void {
    this.loginForm.patchValue({
      nombre: username,
      contrasena: 'demo123',
      tipo: 'Empleado'
    });
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !this.isLoading && !this.isBlocked) {
      this.handleLogin();
    }
  }

  // Getters para facilitar el acceso en el template
  get nombre() { return this.loginForm.get('nombre'); }
  get contrasena() { return this.loginForm.get('contrasena'); }
  get tipo() { return this.loginForm.get('tipo'); }

  // Helper para mostrar errores
  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors && field.touched) {
      const errors = field.errors;
      
      if (errors['required']) return `${fieldName} es obligatorio`;
      if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
      if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
      if (errors['personName']) return errors['personName'].message;
      if (errors['username']) return errors['username'].message;
    }
    
    return '';
  }

  // Helper para formatear tiempo restante
  formatTimeRemaining(): string {
    const minutes = Math.floor(this.blockTimeRemaining / 60);
    const seconds = this.blockTimeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}