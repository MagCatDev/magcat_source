import { z } from "zod";

// WidgetType
export const WidgetTypeSchema = z.enum(["select"]);
export type WidgetType = z.infer<typeof WidgetTypeSchema>;

// Setting
export const SettingSchema = z.object({
  label: z.string(),
  type: WidgetTypeSchema,
  default: z.any().optional(),
  options: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .optional(),
  description: z.string().optional(),
});
export type Setting = z.infer<typeof SettingSchema>;

export const SettingSectionSchema = z.object({
  label: z.string().optional(),
  settings: z.record(SettingSchema),
});

export type SettingSection = z.infer<typeof SettingSectionSchema>;

// Filter
export const FilterSchema = z.object({
  name: z.string(),
  key: z.string(),
  description: z.string().optional(),
  type: WidgetTypeSchema,
  options: z.array(z.object({ value: z.string(), label: z.string() })),
});
export type Filter = z.infer<typeof FilterSchema>;

// Metadata
export const MetadataSchema = z.object({
  icon: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.enum(["engine", "webview"]),
  category: z.enum(["acg", "general", "other"]),
  version: z.string(),
  version_code: z.number(),
  min_app_version_code: z.number(),
  settings: z.array(SettingSectionSchema).optional(),
});
export type Metadata = z.infer<typeof MetadataSchema>;

// SearchOptions
export const SearchOptionsSchema = z.object({
  query: z.string().optional(),
  opts: z.any().optional(),
  filters: z
    .array(z.object({ key: z.string(), value: z.string() }))
    .optional(),
});
export type SearchOptions = z.infer<typeof SearchOptionsSchema>;

// Item
export const ItemSchema = z.object({
  title: z.string(),
  category: z.string().optional(),
  magnet: z.string().optional(),
  download: z.string().optional(),
  torrent: z.string().optional(),
  link: z.string().optional(),
  publisher: z.string().optional(),
  date: z.string().optional(),
  size: z.string().optional(),
  seeders: z.string().optional(),
  leechers: z.string().optional(),
  completed: z.string().optional(),
});
export type Item = z.infer<typeof ItemSchema>;

// SearchResult
export const SearchResultSchema = z.object({
  items: z.array(ItemSchema),
  hasMore: z.boolean(),
  next: z.any().optional(),
});
export type SearchResult = z.infer<typeof SearchResultSchema>;

// BridgeRequest
export const BridgeRequestSchema = z.object({
  method: z.string(),
  params: z.record(z.any()).optional(),
});
export type BridgeRequest = z.infer<typeof BridgeRequestSchema>;