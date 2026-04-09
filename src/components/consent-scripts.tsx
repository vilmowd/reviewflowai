import Script from "next/script";

const STUB_SRC =
  "https://cache.consentframework.com/js/pa/50855/c/hOxgC/stub?source=google-tag";
const CMP_SRC =
  "https://choices.consentframework.com/js/pa/50855/c/hOxgC/cmp?source=google-tag";

export function ConsentScripts() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document -- valid in app/layout */}
      <Script
        id="consentframework-stub"
        src={STUB_SRC}
        strategy="beforeInteractive"
        type="text/javascript"
        {...{ "data-cfasync": "false" }}
      />
      <Script
        id="consentframework-cmp"
        src={CMP_SRC}
        strategy="afterInteractive"
        type="text/javascript"
        async
        {...{ "data-cfasync": "false" }}
      />
    </>
  );
}
