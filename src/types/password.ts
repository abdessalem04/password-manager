export interface Password {
  id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  category: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}