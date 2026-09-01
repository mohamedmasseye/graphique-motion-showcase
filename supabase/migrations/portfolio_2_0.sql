-- ══════════════════════════════════════════════════════════════════
-- PORTFOLIO 2.0 — Migration SQL
-- Run this in Supabase SQL Editor to add new columns.
-- Existing data is preserved. New columns are nullable.
-- ══════════════════════════════════════════════════════════════════

-- Add new columns (nullable for backward compatibility)
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS project_type text DEFAULT 'website';
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS short_description text;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS long_description text;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS client_name text;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS industry text;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS year integer;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS technologies jsonb DEFAULT '[]'::jsonb;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]'::jsonb;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS featured_order integer;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS case_study boolean DEFAULT false;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS challenge text;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS strategy text;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS solution text;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS development text;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS outcome text;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS seo_title text;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS seo_description text;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS og_image text;
ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS published boolean DEFAULT true;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON portfolio (featured, featured_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_published ON portfolio (published);
CREATE INDEX IF NOT EXISTS idx_portfolio_slug ON portfolio (slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_project_type ON portfolio (project_type);

-- Comment for documentation
COMMENT ON TABLE portfolio IS 'Portfolio 2.0 — projects managed via admin CMS';
