
import React from "react";
import DiscountManager from "../components/discount-manager/DiscountManager";
import ErrorBoundary from "../components/ErrorBoundary";

export default function DiscountManagerPage({ onNavigate }) {
  return (
    <ErrorBoundary>
      <DiscountManager onNavigate={onNavigate} />
    </ErrorBoundary>
  );
}
