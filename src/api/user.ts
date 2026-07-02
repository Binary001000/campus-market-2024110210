import http from './http'

export interface UserRecord {
  id: number
  name: string
  college: string
  grade: string
  avatar: string
  bio: string
}

export function getUsers() {
  return http.get<UserRecord[]>('/users')
}

export function getUserById(id: number) {
  return http.get<UserRecord>(`/users/${id}`)
}

export function createUser(data: Omit<UserRecord, 'id'>) {
  return http.post<UserRecord>('/users', data)
}

export function updateUser(id: number, data: Partial<UserRecord>) {
  return http.patch<UserRecord>(`/users/${id}`, data)
}
