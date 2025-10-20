export interface AccessProfile {
  id: number;
  name: string;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phoneNumber: string;
  employmentType: string;
  registrationNumber: string;
  departmentId?: number;
  unitId?: number;
  agencyId?: number;
  isDeleted: boolean;
  createdAt: string;
  deletedAt?: string;
}

export interface UserProfile {
  userId: string;
  accessProfileId: number;
}

export interface UserComplete {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phoneNumber: string;
  employmentType: string;
  registrationNumber: string;
  isDeleted: boolean;
  createdAt: string;
  deletedAt?: string;
  lastSignInAt?: string;
  accessProfileId?: number;
  accessProfileName?: string;
  departmentId?: number;
  departmentName?: string;
  unitId?: number;
  unitName?: string;
  agencyId?: number;
  agencyName?: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  cpf: string;
  phoneNumber: string;
  employmentType: string;
  registrationNumber: string;
  accessProfileId: number;
  departmentId: number;
  unitId: number;
  agencyId: number;
}

export interface UpdateUserInput {
  id: string;
  name: string;
  phoneNumber: string;
  employmentType: string;
  registrationNumber: string;
  accessProfileId: number;
  departmentId: number;
  unitId: number;
  agencyId: number;
}
