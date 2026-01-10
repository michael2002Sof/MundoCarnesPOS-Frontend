import qz from "qz-tray"

let initialized = false

export function initQZSecurity() {
  // Evita doble inicialización (React StrictMode / HMR)
  if (initialized) return
  initialized = true

  // Solo ejecutar en navegador
  if (typeof window === "undefined") return

  // Certificado público (QZ Tray)
  qz.security.setCertificatePromise((resolve) => {
    resolve(`-----BEGIN CERTIFICATE-----
    MIID1TCCAr2gAwIBAgIUP3UkWvE5+owVkbOfUCD11KKDrfQwDQYJKoZIhvcNAQEL
    BQAwejELMAkGA1UEBhMCQ08xGzAZBgNVBAgMEk5vcnRlIGRlIFNhbnRhbmRlcjEP
    MA0GA1UEBwwGQ3VjdXRhMRkwFwYDVQQKDBBNdW5kbyBDYXJuZXMgU0FTMSIwIAYD
    VQQDDBltdW5kb2Nhcm5lc3Bvcy52ZXJjZWwuYXBwMB4XDTI2MDExMDE0MTk0NloX
    DTM2MDEwODE0MTk0NlowejELMAkGA1UEBhMCQ08xGzAZBgNVBAgMEk5vcnRlIGRl
    IFNhbnRhbmRlcjEPMA0GA1UEBwwGQ3VjdXRhMRkwFwYDVQQKDBBNdW5kbyBDYXJu
    ZXMgU0FTMSIwIAYDVQQDDBltdW5kb2Nhcm5lc3Bvcy52ZXJjZWwuYXBwMIIBIjAN
    BgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArZYLWNqmmuwn2G+G0lAywVsgf0Bm
    GPXIIe5mXyWeWc6TcqcxysHS/7OOV76Q307Phmg6tyFh8atTtcKJ9OvGlzvjNgr0
    j2a0CPBGYZSjK2XY8RhVCm8sdzS6Akl5Hh4D/4uq1FMzoR467hlos+SyDNGvt0Uc
    18zgn/G/KjCHskfknF4gdop7s/qmUTwoobXIuzlsc8ZPD+zfJ5yHZvtrqZSM0v2b
    QF1QYWMq6UqBEb0YpAOoiAdGkHNJ0bXpGOrkSFMEaPU8m91HmZvbCtD/HXZ9k/Sd
    1YD4INOoMHLP2LN2ZfbLyu0B//kwCI8TjCDRDRAVM8/GS/0jf/ifp4R4uwIDAQAB
    o1MwUTAdBgNVHQ4EFgQUWUgBNcDsWDaex6QM2qnQOJd25kIwHwYDVR0jBBgwFoAU
    WUgBNcDsWDaex6QM2qnQOJd25kIwDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0B
    AQsFAAOCAQEAa/xJwPWAEPfzmtvQpOyhr/eKpL5uVcBHhck6gAc2pO4h3qymxp+O
    1pZWDFxDf9wDd/OxcKOxvDC+bwgB1CaJ9LmbnYt0/2BklVH9eIxC+k/q0mdEVC23
    RUGUd3N8wH5D9y8ylvOV8yGs5OeuHGXyMwVlYsB+IM7jlewQden3+JZxRcLQK+fY
    icqrVOQUYYCNnHLBq4+kEpnI2G/x1FCYbQPRD8HKQpUmcAgxshvWdKP+6/1Ab5Cz
    2ujLaQlPwWStTEKsebXeLRFYgAj4LeEPFBWBM70ISvNu5LlBZv51aNDd8zT8i/DM
    QPaP+tXAMtcm5OQtiVuURG916Gu5QmHXRg==
    -----END CERTIFICATE-----`)
  })

  // Firma vacía (modo frontend-only)
  qz.security.setSignaturePromise((resolve) => {
    resolve()
  })
}
