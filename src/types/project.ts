
export type ProjectCategory = 'logo' | 'web' | 'print' | 'video' | 'event';

export interface Project {
  id: number;
  title: string;
  category: ProjectCategory;
  image: string;
  link: string;
  description?: string;
}
