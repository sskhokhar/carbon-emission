export interface VehicleMake {
  data: {
    id: string;
    type: string;
    attributes: {
      name: string;
      number_of_models: number;
    };
  };
}

export interface VehicleModel {
  data: {
    id: string;
    type: string;
    attributes: {
      name: string;
      year: number;
      make_id: string;
    };
  };
}
