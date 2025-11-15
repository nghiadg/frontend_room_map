export type PostFormData = {
  payload: {
    title: string;
    description: string;
    propertyTypeId: number;
    area: number;
    amenityIds: number[];
    provinceCode: string;
    districtCode: string;
    wardCode: string;
    address: string;
    lat: number;
    lng: number;
    price: number;
    deposit: number;
    electricityBill: number;
    waterBill: number;
    internetBill: number;
    otherBill: number;
    waterBillUnit: "month" | "m3";
    internetBillUnit: "month" | "person";
    termIds: number[];
    // only used for edit post
    deletedImageIds?: number[];
  };
  images: File[];
};
