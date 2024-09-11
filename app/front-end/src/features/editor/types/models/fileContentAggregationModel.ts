/**
 * `FileContentAggregationActions` enum defines the actions that can be used to aggregate the content of a file.
 */
export enum FileContentAggregationActions {
  NONE = '',
  SUM = 'sum',
  AVG = 'avg',
  MIN = 'min',
  MAX = 'max',
  COUNT = 'cnt',
}

/**
 * `FileContentAggregationModel` interface.
 *
 * @description This interface defines the structure of the FileContentAggregationModel object, which represents the aggregations of the content of a file.
 * The FileContentAggregationModel object contains the aggregations of the file content in the form of `key-value pairs`, where the key is the column name and the value is the aggregation action and value.
 */
export interface FileContentAggregationModel {
  [column: string]: { action: FileContentAggregationActions; value: string };
}
