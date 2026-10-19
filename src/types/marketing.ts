export type MarketingKind = 'todo' | 'scheduled' | 'draft' | 'manual';
export type MarketingStatus = 'planned' | 'done' | 'skipped';

/** Une ligne du plan (une publication sur un réseau). */
export interface PlanItem {
  code: string;
  network: string;
  title: string;
  format_label: string;
  scheduled_at: string;
  kind: MarketingKind;
  asset: string;
  is_price_post: boolean;
  text: string;
  first_comment: string;
  gate: string;
  sticker: string;
  theme: string;
}

export interface MarketingPost {
  id: string;
  code: string;
  network: string;
  title: string;
  format_label: string;
  scheduled_at: string;
  kind: MarketingKind;
  status: MarketingStatus;
  asset: string;
  is_price_post: boolean;
  text_content: string;
  first_comment: string;
  gate: string;
  notes: string;
}
