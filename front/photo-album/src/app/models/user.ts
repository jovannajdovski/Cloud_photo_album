export interface User {
    email: string;
    username: string;
    password: string;
    givenName: string;
    familyName: string;
    birthDate: Date;
    code: string;
    showPassword: boolean;
}


export interface ContentSection {
    name: string;
    updated: Date;
  }

  export interface FamilyMemberUser {
    email: string;
    username: string;
    password: string;
    givenName: string;
    familyName: string;
    birthDate: Date;
    familyMemberUsername: string;
}