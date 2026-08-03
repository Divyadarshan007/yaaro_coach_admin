export type ClientMeasurement = {
  id: string;
  date: string;
  image: string;
  weight: string;
  bodyFat: string;
  neck: string;
  shoulder: string;
  chest: string;
  leftBiceps: string;
  rightBiceps: string;
  leftForearm: string;
  rightForearm: string;
  abdomen: string;
  waist: string;
  hips: string;
  leftThigh: string;
  rightThigh: string;
  leftCalf: string;
  rightCalf: string;
};

export type MeasurementInput = Partial<Omit<ClientMeasurement, "id">> & { date: string };
