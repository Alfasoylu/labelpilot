"use client";

import { useEffect, useState } from "react";

type SourceTrackingState = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  referrer: string;
  landingPage: string;
  sourcePage: string;
};

const initialState: SourceTrackingState = {
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmTerm: "",
  utmContent: "",
  referrer: "",
  landingPage: "",
  sourcePage: "",
};

export function SourceTrackingFields() {
  const [values, setValues] = useState<SourceTrackingState>(initialState);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const path = window.location.pathname || "";

    setValues({
      utmSource: params.get("utm_source") ?? "",
      utmMedium: params.get("utm_medium") ?? "",
      utmCampaign: params.get("utm_campaign") ?? "",
      utmTerm: params.get("utm_term") ?? "",
      utmContent: params.get("utm_content") ?? "",
      referrer: document.referrer || "",
      landingPage: path,
      sourcePage: path,
    });
  }, []);

  return (
    <>
      <input type="hidden" name="utmSource" value={values.utmSource} readOnly />
      <input type="hidden" name="utmMedium" value={values.utmMedium} readOnly />
      <input type="hidden" name="utmCampaign" value={values.utmCampaign} readOnly />
      <input type="hidden" name="utmTerm" value={values.utmTerm} readOnly />
      <input type="hidden" name="utmContent" value={values.utmContent} readOnly />
      <input type="hidden" name="referrer" value={values.referrer} readOnly />
      <input type="hidden" name="landingPage" value={values.landingPage} readOnly />
      <input type="hidden" name="sourcePage" value={values.sourcePage} readOnly />
    </>
  );
}
