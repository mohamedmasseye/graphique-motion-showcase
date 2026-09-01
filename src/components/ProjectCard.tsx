import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { mapCategoryToGroup, PORTFOLIO_CATEGORY_COLORS, PROJECT_TYPE_LABELS } from '@/types/database';
import type { PortfolioProject, ProjectType } from '@/types/database';

interface ProjectCardProps {
  project: PortfolioProject;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export default function ProjectCard({ project, variant = 'default', className = '' }: ProjectCardProps) {
  const catGroup = mapCategoryToGroup(project.category);
  const catColor = PORTFOLIO_CATEGORY_COLORS[catGroup];
  const typeLabel = project.project_type
    ? PROJECT_TYPE_LABELS[project.project_type as ProjectType]
    : project.category;

  if (variant === 'featured') {
    return (
      <Link
        to={`/portfolio/${project.slug}`}
        className={`group relative block overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/15 transition-all duration-500 ${className}`}
      >
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={project.image}
            alt={`${project.title} — ${typeLabel}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full"
              style={{ background: catColor + '22', color: catColor }}>
              {typeLabel}
            </span>
            {project.client_name && (
              <span className="text-white/40 text-[10px] font-medium">{project.client_name}</span>
            )}
          </div>
          <h3 className="font-syne text-xl sm:text-2xl font-black text-white mb-2 leading-tight">
            {project.title}
          </h3>
          {(project.short_description || project.description) && (
            <p className="text-white/50 text-sm line-clamp-2 max-w-lg">
              {project.short_description || project.description}
            </p>
          )}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {project.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="text-[9px] bg-white/10 text-white/50 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 mt-4 text-white/30 text-xs group-hover:text-brand-teal transition-colors">
            Voir le projet <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        to={`/portfolio/${project.slug}`}
        className={`group flex items-center gap-4 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 hover:border-white/15 transition-all ${className}`}
      >
        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white text-sm font-bold truncate group-hover:text-brand-teal transition-colors">{project.title}</p>
          <p className="text-white/40 text-xs truncate">{typeLabel}</p>
        </div>
        <ArrowUpRight size={14} className="text-white/20 group-hover:text-brand-teal shrink-0 transition-colors" />
      </Link>
    );
  }

  // Default variant
  return (
    <Link
      to={`/portfolio/${project.slug}`}
      className={`group block overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/15 transition-all duration-300 ${className}`}
    >
      <div className="aspect-video overflow-hidden relative">
        <img
          src={project.image}
          alt={`${project.title} — ${typeLabel}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full"
            style={{ background: catColor + '22', color: catColor }}
          >
            {typeLabel}
          </span>
          {project.case_study && (
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-orange/20 text-brand-orange">
              Case Study
            </span>
          )}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-syne text-base font-bold text-white group-hover:text-brand-teal transition-colors leading-tight">
            {project.title}
          </h3>
          {project.year && (
            <span className="text-white/25 text-xs shrink-0">{project.year}</span>
          )}
        </div>
        {(project.short_description || project.description) && (
          <p className="text-[#A0A0A0] text-sm line-clamp-2 mt-1">
            {project.short_description || project.description}
          </p>
        )}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] bg-white/[0.06] text-white/40 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
