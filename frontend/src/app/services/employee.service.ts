import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.apollo.query({
      query: gql`
        query GetAllEmployees {
          getAllEmployees {
            id
            firstName
            lastName
            email
            gender
            position
            department
            salary
            profilePicture
          }
        }
      `
    }).pipe(
      map((result: any) => result.data.getAllEmployees)
    );
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.apollo.query({
      query: gql`
        query GetEmployee($id: ID!) {
          getEmployee(id: $id) {
            id
            firstName
            lastName
            email
            gender
            position
            department
            salary
            profilePicture
          }
        }
      `,
      variables: { id }
    }).pipe(
      map((result: any) => result.data.getEmployee)
    );
  }

  createEmployee(employee: Partial<Employee>): Observable<Employee> {
    return this.apollo.mutate({
      mutation: gql`
        mutation CreateEmployee($input: EmployeeInput!) {
          createEmployee(input: $input) {
            id
            firstName
            lastName
            email
            gender
            position
            department
            salary
            profilePicture
          }
        }
      `,
      variables: { input: employee },
      refetchQueries: [{ query: gql`query GetAllEmployees { getAllEmployees { id } }` }]
    }).pipe(
      map((result: any) => result.data.createEmployee)
    );
  }

  updateEmployee(id: string, employee: Partial<Employee>): Observable<Employee> {
    return this.apollo.mutate({
      mutation: gql`
        mutation UpdateEmployee($id: ID!, $input: EmployeeInput!) {
          updateEmployee(id: $id, input: $input) {
            id
            firstName
            lastName
            email
            gender
            position
            department
            salary
            profilePicture
          }
        }
      `,
      variables: { id, input: employee },
      refetchQueries: [{ query: gql`query GetAllEmployees { getAllEmployees { id } }` }]
    }).pipe(
      map((result: any) => result.data.updateEmployee)
    );
  }

  deleteEmployee(id: string): Observable<boolean> {
    return this.apollo.mutate({
      mutation: gql`
        mutation DeleteEmployee($id: ID!) {
          deleteEmployee(id: $id)
        }
      `,
      variables: { id },
      refetchQueries: [{ query: gql`query GetAllEmployees { getAllEmployees { id } }` }]
    }).pipe(
      map((result: any) => result.data.deleteEmployee)
    );
  }

  searchEmployees(criteria: string, value: string): Observable<Employee[]> {
    return this.apollo.query({
      query: gql`
        query SearchEmployees($criteria: String!, $value: String!) {
          searchEmployees(criteria: $criteria, value: $value) {
            id
            firstName
            lastName
            email
            gender
            position
            department
            salary
            profilePicture
          }
        }
      `,
      variables: { criteria, value }
    }).pipe(
      map((result: any) => result.data.searchEmployees)
    );
  }
}