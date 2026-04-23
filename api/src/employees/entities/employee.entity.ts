export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  birth_date: string;
  passport_series: string | null;
  passport_number: string | null;
  passport_issue_date: string | null;
  passport_code: string | null;
  passport_issued_by: string | null;
  registration_address: string | null;
  registration_city: string | null;
  registration_street: string | null;
  registration_house: string | null;
  registration_building: string | null;
  registration_apartment: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
