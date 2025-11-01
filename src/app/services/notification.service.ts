// Archivo: src/app/services/notification.service.ts
// Servicio para mostrar notificaciones al usuario

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notifications.asObservable();

  constructor() { }

  show(notification: Omit<Notification, 'id'>, options?: { duration?: number }): void {
    const id = this.generateId();
    const newNotification: Notification = {
      id,
      duration: options?.duration || 5000, // 5 segundos por defecto
      ...notification
    };

    const currentNotifications = this.notifications.value;
    this.notifications.next([...currentNotifications, newNotification]);

    // Auto-remove después del tiempo especificado
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => this.remove(id), newNotification.duration);
    }
  }

  success(title: string, message?: string, options?: { duration?: number }): void {
    this.show({ type: 'success', title, message }, options);
  }

  error(title: string, message?: string, options?: { duration?: number }): void {
    this.show({ type: 'error', title, message }, { duration: options?.duration || 8000 });
  }

  warning(title: string, message?: string, options?: { duration?: number }): void {
    this.show({ type: 'warning', title, message }, options);
  }

  info(title: string, message?: string, options?: { duration?: number }): void {
    this.show({ type: 'info', title, message }, options);
  }

  remove(id: string): void {
    const currentNotifications = this.notifications.value;
    const filteredNotifications = currentNotifications.filter(n => n.id !== id);
    this.notifications.next(filteredNotifications);
  }

  clear(): void {
    this.notifications.next([]);
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}