import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl: string = 'http://172.16.50.102:8080';

  constructor(private http: HttpClient) { }

  // Method to fetch all the tickets list
  fetchAllTickets(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/tickets`);
  }

  // Method to get the New-Tickets Drop-down values
  getDropDownData() {
    return this.http.get(`${this.baseUrl}/api/tickets/dropdownvalues`);
  }

  // Method to add new ticket with image
  addTicket(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/tickets`, data);
  }

  // Method to add new ticket without image
  addTicketWithoutImage(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/tickets/no-image`, data);
  }

  // Method Update Ticket Value
  updateTicket(data: any, id: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.baseUrl}/api/tickets/${id}`, data, { headers: headers });
  }

  // Method to fetch all inventory devices list
  fetchAllDevices(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/inventory`);
  }

  // Method to add New Inventory device
  addDeviceWithAttachment(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/inventory`, data);
  }

  // Method to add New Inventory device without image
  AddDeviceWithoutAttachment(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/inventory/no-img`, data);
  }

  // Method to update inventory device details
  updateDeviceDetails(data: any, id: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.baseUrl}/api/inventory/${id}`, data, { headers: headers });
  }

  // Method to update inventory device details with new attachment file
  updateDeviceDetailsWithNewFile(data: any, id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/inventory/new-file/${id}`, data);
  }

  // Method to validate JWT token
  refreshToken(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/tickets/token-status`);
  }

  // Method to fetch All the ticket conversations
  fetchTicketConversation(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/tickets/${id}/conversation`);
  }

  // Method to send new message on ticket conversation
  sendNewTicketConversation(id: number, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/tickets/${id}/conversation`, data);
  }

  // Method to send service request mail
  sendServiceRequestMail(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/helpdesk/service-mail`, data);
  }
}