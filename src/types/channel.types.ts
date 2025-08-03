export interface Availability {
  [key: string]: {
    [date: string]: number;
  };
}

export interface Restriction {
  availability: number;
  rate: string;
}

export interface RatePlanOption {
  id: string;
  rate: string;
  occupancy: number;
  is_primary: boolean;
  derived_option: any;
  inherit_availability_offset: boolean;
  inherit_closed_to_arrival: boolean;
  inherit_closed_to_departure: boolean;
  inherit_max_availability: boolean;
  inherit_max_stay: boolean;
  inherit_min_stay_arrival: boolean;
  inherit_min_stay_through: boolean;
  inherit_rate: boolean;
  inherit_stop_sell: boolean;
  rate_category_id: any;
}

export interface RatePlanAttributes {
  id: string;
  meta: any;
  options: RatePlanOption[];
  title: string;
  currency: string;
  auto_rate_settings: any;
  closed_to_arrival: boolean[];
  closed_to_departure: boolean[];
  max_stay: number[];
  min_stay_arrival: number[];
  min_stay_through: number[];
  stop_sell: boolean[];
  cancellation_policy_id: any;
  children_fee: string;
  infant_fee: string;
  inherit_availability_offset: boolean;
  inherit_closed_to_arrival: boolean;
  inherit_closed_to_departure: boolean;
  inherit_max_availability: boolean;
  inherit_max_stay: boolean;
  inherit_min_stay_arrival: boolean;
  inherit_min_stay_through: boolean;
  inherit_rate: boolean;
  inherit_stop_sell: boolean;
  meal_type: string;
  rate_mode: string;
  sell_mode: string;
  tax_set_id: string;
  ui_read_only: boolean;
}

export interface RatePlan {
  attributes: RatePlanAttributes;
  id: string;
  type: string;
  relationships: {
    property: {
      data: {
        id: string;
        type: string;
      };
    };
    room_type: {
      data: {
        id: string;
        type: string;
      };
    };
  };
}

export interface RoomTypeAttributes {
  id: string;
  meta: any;
  position: number;
  title: string;
  content: {
    description: string | null;
    photos: any[];
  };
  occ_adults: number;
  occ_children: number;
  occ_infants: number;
  capacity: any;
  codes: any;
  count_of_rooms: number;
  default_occupancy: number;
  room_kind: string;
}

export interface RoomType {
  attributes: RoomTypeAttributes;
  id: string;
  type: string;
  relationships: {
    property: {
      data: {
        id: string;
        type: string;
      };
    };
    facilities: {
      data: any[];
    };
  };
}

export interface RoomTypeToRatePlans {
  [key: string]: string[];
}

export interface Restrictions {
  [key: string]: {
    [date: string]: Restriction;
  };
}
