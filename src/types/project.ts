
export interface Project {
  id: number;
  title: string;
  category: 'logo' | 'web' | 'print' | 'video';
  image: string;
  link: string;
  description?: string;
}
