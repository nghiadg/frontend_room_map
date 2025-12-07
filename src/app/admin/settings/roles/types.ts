// Settings roles types

export type Role = {
  id: number;
  name: string;
  usersCount: number;
  createdAt: string;
  updatedAt: string;
};

// API response types
export type RolesResponse = {
  roles: Role[];
};
