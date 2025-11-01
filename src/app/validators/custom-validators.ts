// Archivo: src/app/validators/custom-validators.ts
// Validadores personalizados para formularios

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  
  // Validador para nombres de usuario (solo letras, números y algunos símbolos)
  static username(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;
    if (!usernameRegex.test(control.value)) {
      return {
        username: {
          message: 'El usuario debe tener entre 3-20 caracteres (letras, números, ., _, -)'
        }
      };
    }
    return null;
  }

  // Validador para contraseñas seguras
  static strongPassword(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const password = control.value;
    const errors: any = {};
    
    if (password.length < 6) {
      errors.minLength = 'Mínimo 6 caracteres';
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.lowercase = 'Debe contener al menos una letra minúscula';
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.uppercase = 'Debe contener al menos una letra mayúscula';
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.number = 'Debe contener al menos un número';
    }
    
    return Object.keys(errors).length ? { strongPassword: errors } : null;
  }

  // Validador para nombres de persona
  static personName(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;
    if (!nameRegex.test(control.value)) {
      return {
        personName: {
          message: 'Nombre inválido (solo letras y espacios, 2-50 caracteres)'
        }
      };
    }
    return null;
  }

  // Validador para SKUs de productos
  static productSku(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const skuRegex = /^[A-Z]{3}-[A-Z0-9]{2,10}$/;
    if (!skuRegex.test(control.value)) {
      return {
        productSku: {
          message: 'SKU debe seguir el formato: ABC-123 (3 letras, guión, 2-10 caracteres alfanuméricos)'
        }
      };
    }
    return null;
  }

  // Validador para precios
  static price(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const price = parseFloat(control.value);
    if (isNaN(price) || price <= 0) {
      return {
        price: {
          message: 'El precio debe ser un número mayor a 0'
        }
      };
    }
    
    if (price > 999999.99) {
      return {
        price: {
          message: 'El precio no puede exceder $999,999.99'
        }
      };
    }
    
    return null;
  }

  // Validador para stock
  static stock(control: AbstractControl): ValidationErrors | null {
    if (!control.value && control.value !== 0) return null;
    
    const stock = parseInt(control.value);
    if (isNaN(stock) || stock < 0) {
      return {
        stock: {
          message: 'El stock debe ser un número entero mayor o igual a 0'
        }
      };
    }
    
    if (stock > 99999) {
      return {
        stock: {
          message: 'El stock no puede exceder 99,999 unidades'
        }
      };
    }
    
    return null;
  }

  // Validador para emails
  static email(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(control.value)) {
      return {
        email: {
          message: 'Formato de email inválido'
        }
      };
    }
    return null;
  }

  // Validador para teléfonos mexicanos
  static phoneNumber(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const phoneRegex = /^(\+52|52)?[\s\-]?(\d{2})[\s\-]?(\d{4})[\s\-]?(\d{4})$/;
    if (!phoneRegex.test(control.value)) {
      return {
        phoneNumber: {
          message: 'Número de teléfono inválido (formato: 55 1234 5678 o +52 55 1234 5678)'
        }
      };
    }
    return null;
  }

  // Validador personalizado para rangos de fechas
  static dateRange(startDateKey: string, endDateKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startDate = control.get(startDateKey)?.value;
      const endDate = control.get(endDateKey)?.value;
      
      if (!startDate || !endDate) return null;
      
      if (new Date(startDate) > new Date(endDate)) {
        return {
          dateRange: {
            message: 'La fecha de inicio debe ser anterior a la fecha final'
          }
        };
      }
      
      return null;
    };
  }

  // Validador para confirmar contraseña
  static passwordMatch(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordKey)?.value;
      const confirmPassword = control.get(confirmPasswordKey)?.value;
      
      if (!password || !confirmPassword) return null;
      
      if (password !== confirmPassword) {
        return {
          passwordMatch: {
            message: 'Las contraseñas no coinciden'
          }
        };
      }
      
      return null;
    };
  }

  // Validador para cantidad mínima
  static minQuantity(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const quantity = parseInt(control.value);
      if (isNaN(quantity) || quantity < min) {
        return {
          minQuantity: {
            message: `La cantidad mínima es ${min}`
          }
        };
      }
      
      return null;
    };
  }

  // Validador para archivos
  static fileType(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const file = control.value as File;
      if (!allowedTypes.includes(file.type)) {
        return {
          fileType: {
            message: `Tipo de archivo no permitido. Permitidos: ${allowedTypes.join(', ')}`
          }
        };
      }
      
      return null;
    };
  }

  // Validador para tamaño de archivo
  static fileSize(maxSizeInMB: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const file = control.value as File;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      
      if (file.size > maxSizeInBytes) {
        return {
          fileSize: {
            message: `El archivo no puede exceder ${maxSizeInMB}MB`
          }
        };
      }
      
      return null;
    };
  }

  // Validador para fecha de nacimiento
  static dateOfBirth(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const birthDate = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Verificar que la fecha no sea futura
    if (birthDate > today) {
      return { dateOfBirth: { message: 'La fecha de nacimiento no puede ser futura' } };
    }
    
    // Verificar edad mínima (13 años)
    if (age < 13 || (age === 13 && monthDiff < 0)) {
      return { dateOfBirth: { message: 'Debes tener al menos 13 años para registrarte' } };
    }
    
    // Verificar edad máxima (120 años)
    if (age > 120) {
      return { dateOfBirth: { message: 'Fecha de nacimiento inválida' } };
    }
    
    return null;
  }
}