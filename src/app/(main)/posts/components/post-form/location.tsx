import LoadingContainer from "@/components/loading-container";
import { LocationField } from "@/components/location-field";
import { MapLocationPickerDialog } from "@/components/map-location-picker/map-location-picker-dialog";
import MapBox from "@/components/map/mapbox";
import MarkerDefault from "@/components/map/marker-default";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ERROR_MESSAGE } from "@/constants/error-message";
import { useBoolean } from "@/hooks/useBoolean";
import { errorHandler } from "@/lib/errors";
import { getMapboxGeocodingForward } from "@/services/client/map";
import { Coordinates } from "@/types/location";
import NiceModal from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { debounce } from "lodash";
import { MapPinIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef } from "react";
import {
  Controller,
  FormState,
  useForm,
  useFormState,
  useWatch,
} from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  province: z.any().refine((value) => value !== undefined, {
    message: ERROR_MESSAGE.REQUIRED,
  }),
  district: z.any().refine((value) => value !== undefined, {
    message: ERROR_MESSAGE.REQUIRED,
  }),
  ward: z.any().refine((value) => value !== undefined, {
    message: ERROR_MESSAGE.REQUIRED,
  }),
  address: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED }),
  lat: z.number().min(1, { message: ERROR_MESSAGE.REQUIRED }),
  lng: z.number().min(1, { message: ERROR_MESSAGE.REQUIRED }),
});

export type LocationData = z.infer<typeof schema>;

type LocationProps = {
  onNextStep: (data: LocationData) => void;
  onPreviousStep: () => void;
};

export default function Location({
  onNextStep,
  onPreviousStep,
}: LocationProps) {
  const t = useTranslations();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { handleSubmit, setValue, control, subscribe } = useForm<
    z.infer<typeof schema>
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      province: undefined,
      district: undefined,
      ward: undefined,
      address: "",
      lat: undefined,
      lng: undefined,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const province = useWatch({ control, name: "province", exact: true });
  const district = useWatch({ control, name: "district", exact: true });
  const ward = useWatch({ control, name: "ward", exact: true });
  const lat = useWatch({ control, name: "lat", exact: true });
  const lng = useWatch({ control, name: "lng", exact: true });

  const { errors: locationErrors } = useFormState({
    control,
    name: ["province", "district", "ward"],
    exact: true,
  });

  const { errors: coordinatesErrors } = useFormState({
    control,
    name: ["lat", "lng"],
    exact: true,
  });

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
        initialZoom: 16,
      }
    );
    if (location) {
      setValue("lat", location.lat, { shouldValidate: true });
      setValue("lng", location.lng, { shouldValidate: true });
      mapRef.current?.flyTo({
        center: [location.lng, location.lat],
        zoom: 16,
      });
    }
  };

  const onSubmit = (data: LocationData) => {
    onNextStep(data);
  };

  const onAddressChange = useMemo(() => {
    return debounce(
      async (
        form: Partial<
          FormState<z.infer<typeof schema>> & { values: z.infer<typeof schema> }
        >
      ) => {
        const isNotFilled =
          !form.values?.province ||
          !form.values?.district ||
          !form.values?.ward ||
          !form.values?.address;
        if (isNotFilled) return;
        try {
          setIsLoadingCoordinatesTrue();
          const query = [
            form.values?.address,
            form.values?.province?.name,
            form.values?.district?.name,
            form.values?.ward?.name,
          ]
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
              zoom: 16,
            });
          }
        } catch (error) {
          errorHandler(error);
        } finally {
          setIsLoadingCoordinatesFalse();
        }
      },
      2_000
    );
  }, [setIsLoadingCoordinatesFalse, setIsLoadingCoordinatesTrue, setValue]);

  useEffect(() => {
    const subscription = subscribe({
      name: ["district", "ward", "province", "address"],
      formState: {
        values: true,
      },
      callback: onAddressChange,
    });
    return () => subscription();
  }, [onAddressChange, subscribe]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                  <FieldError
                    errors={[{ message: fieldState.error?.message }]}
                  />
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
              initialZoom={13}
              wrapperClassName="h-96"
              interactive={false}
            >
              <MarkerDefault lng={lng} lat={lat} />
            </MapBox>
          </LoadingContainer>
          {coordinatesErrors?.lat?.message ||
          coordinatesErrors?.lng?.message ? (
            <FieldError
              errors={[{ message: ERROR_MESSAGE.MUST_SELECT_LOCATION }]}
            />
          ) : null}
        </Field>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onPreviousStep} type="button">
            {t("common.back")}
          </Button>
          <Button variant="default" type="submit">
            {t("common.next")}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
