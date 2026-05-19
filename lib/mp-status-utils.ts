export const MP_STATUS_TRANSLATIONS: Record<string, string> = {
  created: "Creado",
  approved: "Aprobado",
  processed: "Procesado",
  processing: "En procesamiento",
  action_required: "Acción requerida",
  charged_back: "Contracargo",
  expired: "Expirado",
  refunded: "Reembolsado",
  failed: "Fallido",
  cancelled: "Cancelado",
  canceled: "Cancelado",
  in_review: "En revisión",
  manual_override: "Anulación manual",
};

export const MP_DETAIL_TRANSLATIONS: Record<string, string> = {
  created: "La transacción fue creada con éxito, pero aún no ha sido procesada.",
  accredited: "El monto ha sido efectivamente acreditado.",
  partially_refunded: "La transacción fue procesada con éxito y una parte del monto fue reembolsada.",
  in_process: "La transacción está en curso y aún no se ha completado.",
  pending_review_manual: "Esperando una revisión manual de Mercado Pago.",
  waiting_payment: "Esperando que se complete el pago.",
  waiting_capture: "El pago ha sido autorizado, pero aún no ha sido capturado.",
  waiting_transfer: "Los fondos aún no se han transferido a la cuenta.",
  pending_challenge: "Desafío de 3DS iniciado. El comprador tiene hasta 40 minutos para completarlo.",
  settled: "La transacción fue impugnada y el monto fue reembolsado al comprador.",
  reimbursed: "La transacción fue impugnada y el monto fue acreditado al vendedor.",
  expired: "La transacción no se completó dentro del tiempo límite.",
  refunded: "El monto de la transacción ha sido devuelto íntegramente al pagador.",
  bad_filled_card_data: "Datos de la tarjeta completados incorrectamente.",
  invalid_card_token: "Token de tarjeta inválido.",
  high_risk: "Transacción rechazada por prevención de fraudes (alto riesgo).",
  rejected_by_issuer: "Rechazado por el emisor de la tarjeta.",
  required_call_for_authorize: "Se requiere llamada telefónica al emisor para autorizar.",
  max_attempts_exceeded: "Se excedió el número máximo de intentos de pago.",
  card_disabled: "La tarjeta está desactivada.",
  insufficient_amount: "Fondos suficientes no disponibles.",
  card_insufficient_amount: "La tarjeta elegida no tiene fondos suficientes.",
  amount_limit_exceeded: "El monto supera el límite permitido para esta tarjeta.",
  processing_error: "Error técnico temporal en el procesamiento del pago.",
  invalid_installments: "El número de cuotas seleccionado no es válido.",
  "3ds_challenge_expired": "El tiempo para completar la autenticación 3DS ha expirado.",
  in_review: "El pago está en análisis automático de prevención de fraudes.",
  manual_override_to_accepted: "El administrador marcó la orden como aceptada manualmente.",
  manual_override_to_cancelled: "El administrador marcó la orden como cancelada manualmente.",
  manual_override_to_pending: "El administrador marcó la orden como pendiente manualmente.",
};

/**
 * Translates a Mercado Pago status code to a human-readable Spanish label.
 */
export function translateMpStatus(status?: string | null): string {
  if (!status) return "—";
  return MP_STATUS_TRANSLATIONS[status] ?? status;
}

/**
 * Translates a Mercado Pago status detail code to a human-readable Spanish description.
 */
export function translateMpStatusDetail(detail?: string | null): string {
  if (!detail) return "—";
  return MP_DETAIL_TRANSLATIONS[detail] ?? detail;
}
