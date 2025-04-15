
export type ProjectCategory = 'logo' | 'web' | 'print' | 'video';

export interface Project {
  id: number;
  title: string;
  category: ProjectCategory;
  image: string;
  link: string;
  description?: string;
}
