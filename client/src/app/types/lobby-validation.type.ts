import { Observable } from 'rxjs';
export type ValidationResult<T> = [T, Observable<never>] | [T, null];
