/** Setting record as stored in the database */
export interface Setting {
  key: string;
  value: string;
  updated_at: string;
}

/** Input DTO for updating a setting */
export interface UpdateSettingInput {
  value: string;
}
