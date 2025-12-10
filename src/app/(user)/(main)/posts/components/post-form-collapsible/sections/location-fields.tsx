"use client";

import LoadingContainer from "@/components/user/loading-container";
import { LocationField } from "@/components/user/location-field";
import { MapLocationPickerDialog } from "@/components/user/map-location-picker/map-location-picker-dialog";
import MapBox from "@/components/user/map/mapbox";
import MarkerDefault from "@/components/user/map/marker-default";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ERROR_MESSAGE } from "@/constants/error-message";
import { useBoolean } from "@/hooks/use-boolean";
import { errorHandler } from "@/lib/errors";
import { getMapboxGeocodingForward } from "@/services/client/map";
import { Coordinates } from "@/types/location";
import NiceModal from "@ebay/nice-modal-react";
import { debounce } from "lodash";
import { MapPinIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo, useEffect, useMemo, useRef } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { PostFormValues } from "../schema";

// Constants
const GEOCODING_DEBOUNCE_MS = 2000;
const DEFAULT_MAP_ZOOM = 16;

type LocationFieldsProps = {
  initialLat?: number;
  initialLng?: number;
};

function LocationFieldsComponent({
  initialLat,
  initialLng,
}: LocationFieldsProps) {
  const t = useTranslations();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { control, setValue, formState } = useFormContext<PostFormValues>();

  const province = useWatch({ control, name: "province", exact: true });
  const district = useWatch({ control, name: "district", exact: true });
  const ward = useWatch({ control, name: "ward", exact: true });
  const address = useWatch({ control, name: "address", exact: true });
  const lat = useWatch({ control, name: "lat", exact: true });
  const lng = useWatch({ control, name: "lng", exact: true });

  const locationErrors = formState.errors;

  const {
    value: isLoadingCoordinates,
    setTrue: setIsLoadingCoordinatesTrue,
    setFalse: setIsLoadingCoordinatesFalse,
  } = useBoolean(false);

  const onClickSelectLocation = async () => {
    const location: Coordinates | undefined = await NiceModal.show(
      MapLocationPickerDialog,
      {
        initialLng: lng,
        initialLat: lat,
        initialZoom: DEFAULT_MAP_ZOOM,
      }
    );
    if (location) {
      setValue("lat", location.lat, { shouldValidate: true });
      setValue("lng", location.lng, { shouldValidate: true });
      mapRef.current?.flyTo({
        center: [location.lng, location.lat],
        zoom: DEFAULT_MAP_ZOOM,
      });
    }
  };

  const onAddressChange = useMemo(() => {
    return debounce(async () => {
      const isNotFilled = !province || !district || !ward || !address;
      if (isNotFilled) return;
      try {
        setIsLoadingCoordinatesTrue();
        const query = [address, province?.name, district?.name, ward?.name]
          .filter(Boolean)
          .join(", ");
        const response = await getMapboxGeocodingForward(query);
        if (response.features.length > 0) {
          const feature = response.features[0];
          setValue("lat", feature.geometry.coordinates[1], {
            shouldValidate: true,
          });
          setValue("lng", feature.geometry.coordinates[0], {
            shouldValidate: true,
          });
          mapRef.current?.flyTo({
            center: [
              feature.geometry.coordinates[0],
              feature.geometry.coordinates[1],
            ],
            zoom: DEFAULT_MAP_ZOOM,
          });
        }
      } catch (error) {
        errorHandler(error);
      } finally {
        setIsLoadingCoordinatesFalse();
      }
    }, GEOCODING_DEBOUNCE_MS);
  }, [
    province,
    district,
    ward,
    address,
    setIsLoadingCoordinatesTrue,
    setIsLoadingCoordinatesFalse,
    setValue,
  ]);

  useEffect(() => {
    onAddressChange();
    return () => {
      onAddressChange.cancel();
    };
  }, [province, district, ward, address, onAddressChange]);

  return (
    <FieldGroup>
      <Field>
        <LocationField
          province={province}
          setProvince={(province) => {
            setValue("province", province, { shouldValidate: true });
          }}
          district={district}
          setDistrict={(district) => {
            setValue("district", district, { shouldValidate: true });
          }}
          ward={ward}
          setWard={(ward) => {
            setValue("ward", ward, { shouldValidate: true });
          }}
          provinceInvalid={locationErrors?.province?.message ? true : false}
          districtInvalid={locationErrors?.district?.message ? true : false}
          wardInvalid={locationErrors?.ward?.message ? true : false}
        />
        {locationErrors?.province?.message ||
        locationErrors?.district?.message ||
        locationErrors?.ward?.message ? (
          <FieldError
            errors={[{ message: ERROR_MESSAGE.MUST_FILL_ALL_INFORMATION }]}
          />
        ) : null}
      </Field>

      <Field>
        <FieldLabel>{t("posts.location.address")}</FieldLabel>
        <Controller
          name="address"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <Input
                placeholder={t("posts.location.address_placeholder")}
                {...field}
                aria-invalid={fieldState.invalid ? "true" : "false"}
              />
              {fieldState.invalid && (
                <FieldError errors={[{ message: fieldState.error?.message }]} />
              )}
            </>
          )}
        />
      </Field>

      <Field>
        <FieldLabel>
          <div className="flex items-center gap-2">
            <p>{t("posts.location.map")}</p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-fit ml-auto"
              onClick={onClickSelectLocation}
            >
              <MapPinIcon className="size-4" />
              {t("common.select_location")}
            </Button>
          </div>
        </FieldLabel>
        <LoadingContainer
          isLoading={isLoadingCoordinates}
          className="rounded-md overflow-hidden"
        >
          <MapBox
            ref={mapRef}
            initialZoom={DEFAULT_MAP_ZOOM}
            initialLng={initialLng}
            initialLat={initialLat}
            wrapperClassName="h-96"
            interactive={false}
          >
            {lat && lng && <MarkerDefault lng={lng} lat={lat} />}
          </MapBox>
        </LoadingContainer>
        {locationErrors?.lat?.message || locationErrors?.lng?.message ? (
          <FieldError
            errors={[{ message: ERROR_MESSAGE.MUST_SELECT_LOCATION }]}
          />
        ) : null}
      </Field>
    </FieldGroup>
  );
}

export const LocationFields = memo(LocationFieldsComponent);
