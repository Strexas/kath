import { EditorColumnMenuAggregationActions } from '@/features/editor/types';

export interface ColumnAggregation {
  [field: string]: { action: EditorColumnMenuAggregationActions; value: string };
}
