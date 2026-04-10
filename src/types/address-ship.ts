export interface GeoinfoType {
  region: {
    latitude: number;
    longitude: number;
  };
  user_adjusted?: boolean;
  user_verified?: boolean;
  auto_fill: boolean;
  source?: string;
  timestamp?: string;
  additionalData?: Record<string, unknown>;
}

export type DivisionRecordType = Record<string, string>;

export interface AddressShipType {
  id: number;
  userId: number;
  name: string;
  phone: string;
  countryId: number;
  divisionId: number;
  divisionPath: DivisionRecordType | null;
  street?: string | null;
  houseNumber?: string | null;
  address: string;
  addressInstruction?: string | null;
  zipcode?: string | null;
  town?: string | null;
  labelId?: number | null;
  isDeliveryAddress: boolean;
  isDefault: boolean;
  deletedAt?: Date | string | null;
  geoinfo?: GeoinfoType | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreateAddressShipBodyType {
  address: string;
  addressInstruction?: string | null;
  countryId: number;
  divisionId: number;
  divisionPath?: DivisionRecordType | null;
  geoinfo?: GeoinfoType | null;
  houseNumber?: string | null;
  isDefault?: boolean;
  isDeliveryAddress?: boolean;
  labelId?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  name: string;
  phone: string;
  street?: string | null;
  town?: string | null;
  zipcode?: string | null;
}

export type UpdateAddressShipBodyType = Partial<CreateAddressShipBodyType>;
